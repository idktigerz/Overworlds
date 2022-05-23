const res = require('express/lib/response');
var pool = require('./connection.js')

module.exports.getMatchOfPlayer = async function (pmId) {
    try {
        let sqlCheck = `select * from matches ,player_match
    where pm_id = $1 and pm_match_id = mtc_id`;
        let resCheck = await pool.query(sqlCheck, [pmId]);
        if (resCheck.rows.length == 0)
            return { status: 400, result: { msg: "That player is not on a match" } };
        return { status: 200, result: resCheck.rows[0] };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}


module.exports.getPlayerMatch = async function (pmId) {
    try {
        let sqlCheck = `select * from player_match
        where pm_id = $1`;
        let resCheck = await pool.query(sqlCheck, [pmId]);
        if (resCheck.rows.length == 0)
            return { status: 400, result: { msg: "That player does not exist" } };
        return { status: 200, result: resCheck.rows[0] };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.getOpponent = async function (pmId, matchId) {
    try {
        let sqlCheckOp = `select * from player_match 
                          where pm_match_id = $1
                          and pm_id != $2`;
        let resCheckOp = await pool.query(sqlCheckOp, [matchId, pmId]);
        if (resCheckOp.rows.length == 0)  
            return { status: 400, result: { msg: "That match is missing an opponent" } };
        return { status:200, result:resCheckOp.rows[0] };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}
const NCARDS = 5

module.exports.getCardFromDeck = async function (pmId) {
    try {
        let res = await this.getMatchOfPlayer(pmId);
        if (res.status != 200) return res;
        let player = res.result;
        if (player.mtc_turn == 1) {
            for(let i=0; i < NCARDS; i++) {
                let sql = `select dk_id from deck where dk_st_id = 1 and dk_pm_id = $1
                       order by random()
                       LIMIT 1`;
                let res = await pool.query(sql, [pmId]);
                let cardId = res.rows[0].dk_id;
                sql = `update deck set dk_st_id = 2 where dk_pm_id = $1 and dk_id = $2 returning *`;         
                await pool.query(sql,[pmId,cardId]);
            }
        }else{
            for(let i=0; i < 1; i++) {
                let sql = `select dk_id from deck where dk_st_id = 1 and dk_pm_id = $1
                       order by random()
                       LIMIT 1`;
                let res = await pool.query(sql, [pmId]);
                let cardId = res.rows[0].dk_id;
                sql = `update deck set dk_st_id = 2 where dk_pm_id = $1 and dk_id = $2 returning *`;         
                await pool.query(sql,[pmId,cardId]);
            }
        }
        return { status: 200, result: {msg: "Succesufully got cards from deck"}}
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}


module.exports.getPlayerDeckCard = async function(pmId, deckId){
    try {
        let sqlDeck = `Select * from deck where dk_id = $1 and dk_pm_id = $2`;
        let resultDeck = await pool.query(sqlDeck, [deckId, pmId]);
        if (resultDeck.rows.length > 0){
            return { status: 200, result: resultDeck.rows[0]};
        }else{
            return { status: 400, result: {msg: "The player does not own the card"} }
        }
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.attackPlayer = async function (pmId, deckId) {
    try {
        let res;
        // get player match info 
        res = await this.getPlayerMatch(pmId);
        if (res.status != 200) return res;
        
        let player = res.result;
        if (player.pm_state_id != 2)
            return { status: 400, result: { msg: "You cannot attack at this moment" } };
        
        // get player deck card info
        res = await this.getPlayerDeckCard(pmId,deckId)
        if (res.status != 200) return res;
        let card = res.result;
        if (card.deck_st_id != 2)
            return { status: 400, result: { msg: "The card cannot attack at this moment" } };
        // get opponent info
        let matchId = player.pm_match_id;
        res = await this.getOpponent(pmId,matchId);
        if (res.status != 200) return res;
        let opponent = res.result;
        let opPmId = opponent.pm_id;
        // check if opponent deck as no "living" cards
        let sqlCheckOpDeck = `select * from deck 
                             where dk_pm_id = $1
                             and (dk_st_id = 3) 
                             and dk_crd_hp > 0`;
        let resCheckOpDeck = await pool.query(sqlCheckOpDeck, [opPmId]);
        if (resCheckOpDeck.rows.length != 0)
            return {status: 400, result: {msg: "Cannot attack opponent, some cards still have HP left"}}; 
        // Mark the card has "TablePlayed"
        let sqlUpPos = `update deck set dk_st_id = 3
                        where dk_id = $1`
        await pool.query(sqlUpPos, [deckId]);
        // remove 1 from opponent life
        let sqlUpHp = `update player_match set pm_hp = pm_hp - 1
                        where pm_id = $1`
        await pool.query(sqlUpHp, [opPmId]);
        //add code for the health 
        if (sqlUpHp.result.rows > 0){
            let sqlGetRandCard = `select dk_id from deck where dk_st_id = 5 
                                    ORDER BY RANDOM() limit 1`;
            let resGetRandCard = await pool.query(sqlGetRandCard);
            let randCard = resGetRandCard.rows[0].dk_id;
            let sqlUpdate = `update deck set dk_st_id = 2 where dk_id = $1`
            await pool.query(sqlUpdate, [randCard]);

        }
           
        return {status:200, result: {msg: "Successfully removed 1 HP from the opponent "}}
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.attackCard = async function (pmId, deckId, opDeckId) {
    try {
        let res;
        // get player match info 
        res = await this.getPlayerMatch(pmId);
        if (res.status != 200) return res;
        let player = res.result;
        if (player.pm_state_id != 2)
            return { status: 400, result: { msg: "You cannot attach at this moment" } };
        // get player deck card info
        res = await this.getPlayerDeckCard(pmId,deckId)
        if (res.status != 200) return res;
        let card = res.result;
        if (card.deck_pos_id != 2)
            return { status: 400, result: { msg: "The card cannot attack at this moment" } };
        // get opponent info
        let matchId = player.pm_match_id;
        res = await this.getOpponent(pmId,matchId);
        if (res.status != 200) return res;
        let opponent = res.result;
        let opPmId = opponent.pm_id;
        
        res = await this.getPlayerDeckCard(opPmId, opDeckId,"opponent");
        if (res.status != 200) return res;
        let opCard = res.result;     
        if ((opCard.dk_st_id != 3) || opCard.dk_hp <= 0)
            return { status: 400, result: { msg: "You can only attack cards on the table with HP higher or equal to zero." } };

        // Now everything is ok. Lets make the attack
        // Mark the card has "TablePlayed"
        let sqlUpPos = `update dk set dk_st_id = 3
                        where dk_id = $1`
        await pool.query(sqlUpPos, [deckId]);

        let sqlBattle = `select dk_crd_hp, crd_atk from deck, cards 
                      where dk_id = $1 and dk_id = $2`
        await pool.query(sqlBattle, [card.dk_crd_id, opCard.dk_crd_id]);
        let sqlWin = `update deck set dk_crd_hp = dk_crd_hp - 1
                      where dk_id = $1 and dk_id = $2`
        await pool.query(sqlWin, [deckId ,opDeckId]);
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.endTurn = async function (pmId) {
    try {
        let res;
        // get player match info 
        res = await this.getPlayerMatch(pmId);
        if (res.status != 200) return res;
        let player = res.result;
        if (player.pm_state_id == 4 )
            return { status: 400, result: { msg: "You cannot end turn at this moment" } };

        // get opponent info
        let matchId = player.pm_match_id;
        res = await this.getOpponent(pmId,matchId);
        if (res.status != 200) return res;
        let opponent = res.result;

        // Set player match states
        let sqlUpState = `update player_match set pm_state_id = $1 
                          where pm_id = $2`;
        // the opponent has not yet played
        if (opponent.pm_state_id == 1) {
            // change state of player to EndTurn
            await pool.query(sqlUpState, [2, pmId]);
            // change state of opponent to PlayCard
            await pool.query(sqlUpState, [2, opponent.pm_id]);
        } else if (opponent.pm_state_id == 2) {
            await pool.query(sqlUpState, [3, pmId]);
        }else if (opponent.pm_state_id == 3) { // if both have ended the turn 
            // delete all cards that died from both players in the match
            // Cards on the hand have full HP so no need to check the card position
            let sqlDeck = `update deck set dk_st_id = 4
                           where (dk_pm_id = $1 or dk_pm_id = $2)  
                           and dk_crd_hp <= 0`;
            await pool.query(sqlDeck, [pmId, opponent.pm_id]);
            // change state of player to Wait (opponent will go first this time)
            await pool.query(sqlUpState, [4, pmId]);
            // change state of opponent to PlayCard
        } else {
            return { status: 500, result: { msg: "Current state of the players in the match is not valid" } }
        }
        // Check for end game condition
        if (opponent.pm_hp <= 0 || player.pm_hp <= 0) {
            let sqlEnd = `Update matches set mtc_finished = true
                          Where mtc_id = $1`;
            await pool.query(sqlEnd, [matchId]);
            return { status: 200, result: { msg: "Game Ended" } };
        }
        // get a new card for the next player playing (the opponent)
        // get random card value
        let sqlRandCard = `Select dk_id from deck
                           where dk_st_id = 1                    
                           order by RANDOM() 
                           LIMIT 1`;
        let resRandCard = await pool.query(sqlRandCard);
        let cardId = resRandCard.rows[0].dk_id;
        // insert card in the opponent deck (hand, random type, 4 hp)
        let sqlUpdatePlayerHand = `update deck set dk_st_id = 2 where dk_id = $1 and pm_state_id = 2`;
        await pool.query(sqlUpdatePlayerHand, [player.pm_id, cardId]);
        let sqlUpdateOpHand = `update deck set dk_st_id = 2 where dk_id = $1 pm_state_id = 2`;
        await pool.query(sqlUpdateOpHand, [opponent.pm_id, cardId]);

        return { status: 200, result: { msg: "Turn ended" } };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.playCard = async function (pmId, deckId) { 
    try {
        let res = await this.getPlayerMatchInfo(pmId);
        if (res.status != 200) return res;
        let player = res.result;
        if (player.pm_state_id != 2 ) 
            return {status:400, result: {msg:"Cannot play a card at this moment"}};        
        
        res =  await this.getPlayerDeckCard(pmId,deckId);
        if (res.status != 200) return res;
        let playerCard = res.result;
        if (playerCard.dk_st_id != 2)
            return {status:400, result: {msg:"That card is not on the hand to be played"}};
        let sqlUpCard = `update deck set dk_st_id = 3
                         where dk_id = $1`;
        await pool.query(sqlUpCard, [deckId]);

        return {status:200, result:{msg:"Card was successfully played on the table"}}
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
      }    
  }



module.exports.getPlayerDeck = async function (pId,pmId) { 
    try {
        let sqlCheck = `select * from player_match where pm_player_id = $1 and pm_id = $2`;
        let resultCheck = await pool.query(sqlCheck, [pId,pmId]);
        if (resultCheck.rows.length > 0) { // I'm the owner of the deck
            let sql = `select dk_id, dk_pm_id, dk_st_id, dk_crd_id, dk_crd_hp,
            st_name, crd_name, crd_atk, crd_stk, crd_cost
            from deck, card_state, cards 
            where dk_pm_id = $1 and
                dk_st_id = st_id and
                dk_crd_id = crd_id`;
            let result = await pool.query(sql, [pmId]);
            let cards = result.rows;
            return { status: 200, result: cards };
        }
        let sqlCheckOp = `
            select * from player_match 
            where pm_player_id = $1 and pm_match_id IN
                (select pm_match_id from player_match where pm_id = $2)`;
        let resultCheckOp = await pool.query(sqlCheckOp, [pId,pmId]);
        
        if (resultCheckOp.rows.length > 0) {
            let sql = `select dk_id, dk_pm_id, dk_st_id, dk_crd_id, dk_crd_hp,
            st_name, crd_name, crd_atk, crd_stk, crd_cost
            from deck, card_state, cards 
            where dk_pm_id = $1 and
            dk_st_id = st_id and
            dk_crd_id = crd_id`;
            let result = await pool.query(sql, [pmId]);
            let cards = result.rows;
            return { status: 200, result: cards };
        } 
        return { status: 401, result: { msg: "You are not playing in this match"} };
        
    } catch (err) {
      console.log(err);
      return { status: 500, result: err };
    }    
}




module.exports.getPlayerMatchInfo = async function (pmId) { 
    try {
        let sql = `	select pm_id, pm_state_id, pm_hp, pm_mana, pms_name, mtc_turn, mtc_finished, usr_name, usr_id  
        from player_match, pm_state, matches, users  
        where 
          pm_player_id = usr_id and
          pm_state_id = pms_id and
          pm_match_id = mtc_id and
          pm_id = $1`;
        let result = await pool.query(sql, [pmId]);
        if (result.rows.length > 0) {
            let player = result.rows[0];
            return { status: 200, result: player };
        } else {
            return { status: 404, result: { msg: "No playermatch with that id" } };
        }
    } catch (err) {
      console.log(err);
      return { status: 500, result: err };
    }    
}

module.exports.login = async function (username, password) {
    try {
        let sql = `Select usr_name, usr_id from users
        where usr_name = $1 and usr_passwd = $2`;
        let result = await pool.query(sql, [username,password]);
        if (result.rows.length > 0) {
            let player = result.rows[0];
            return { status: 200, result: player };
        } else {
            return { status: 401, result: { msg: "Wrong username/password" } };
        }
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}


module.exports.getPlayerInfo = async function (playerId) {
    try {
        let sql = `Select usr_name from player where usr_id = $1`;
        let result = await pool.query(sql, [playerId]);
        if (result.rows.length > 0) {
            let player = result.rows[0];
            return { status: 200, result: player };
        } else {
            return { status: 404, result: { msg: "No player with that id" } };
        }
    } catch (err) {
      console.log(err);
      return { status: 500, result: err };
    }
  }

module.exports.getPlayerMatches = async function (pId) {
    try {
        let sql = `Select * from player_match 
                    where pm_player_id = $1`;
        let result = await pool.query(sql, [pId]);
        return { status: 200, result: result.rows };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.register = async function (username,password) {
    try {
        if (password.length < 4 || username.length < 4) 
            return { status: 400, 
                result: {msg: "Username must have at least 4 characters and password at least 8"} };
    
        let sql = `Select usr_name from users 
                   where usr_name = $1`;
        let result = await pool.query(sql, [username]);
        if (result.rows.length > 0) {
            return { status: 400, result: {msg: "That player name is already in use."} };
        }else{
            sql = `Insert into users(usr_name, usr_passwd) values($1,$2)`;
            await pool.query(sql, [username,password]);
            return { status: 200, result: { msg: "Player created" } };
        }
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.getPlayersAndMatchesWaiting =  async function (pId) {
    try {
        let sql = `select mtc_id, pm_id, usr_name from player_match, matches, users
                   where pm_match_id = mtc_id and mtc_finished = false and
                   usr_id = pm_player_id and
                   (select count(*) from player_match where pm_match_id = mtc_id) = 1`
        let res = await pool.query(sql);
        return {status:200, result: res.rows};
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }

}

module.exports.getPlayerActiveMatches = async function (pId) {
    try {
        let sql = `Select * from player_match, matches 
                    where pm_match_id = mtc_id 
                    and mtc_finished = false and pm_player_id = $1`;
        let result = await pool.query(sql, [pId]);
        return { status: 200, result: result.rows };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}


module.exports.createRandomCards = async function (pmId,nCards) {
    try {
        for(let i=0; i < nCards; i++) {
            let sql = `select crd_id from cards 
                   order by random()
                   LIMIT 1`;
            let res = await pool.query(sql);
            let cardId = res.rows[0].crd_id;
            sql = `insert into deck (dk_pm_id, dk_st_id, dk_crd_id, dk_crd_hp) 
                    values ($1,1,$2,4) returning *`;         
            await pool.query(sql,[pmId,cardId]);
        }
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.createMatch = async function (pId) {
    try {
        let res = await this.getPlayerActiveMatches(pId);
        if (res.result.length > 0){
            return {status:400, 
            result:{msg:"You can only have one active match."}}
        }else{
            let sql = `insert into matches (mtc_turn, mtc_finished) 
                    values (1, false) returning *`;
            res = await pool.query(sql);
            let matchId = res.rows[0].mtc_id;
            // player starts first
            sql = `insert into player_match (pm_player_id, pm_match_id, pm_state_id, pm_hp, pm_mana) 
               values ($1, $2, 2, 10, 1) returning *`;         
            res = await pool.query(sql,[pId, matchId]);
            let pmId = res.rows[0].pm_id;
            // Create 3 random cards (with repetition)
            this.createRandomCards(pmId, 44);
            this.getCardFromDeck(pmId, 5);
            return { status: 200, result: 
                {msg: "Match successfully created.", matchId: matchId, pmId: pmId} };
        }
            
        
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.joinMatch = async function (pId,mId) {
    try {
        let res = await this.getPlayerActiveMatches(pId);
        if (res.result.length > 0)
            return {status:400, 
                result:{msg:"You can only have one active match."}}
        
        let sql = `select * from player_match where pm_match_id = $1`;
        res = await pool.query(sql,[mId]);
        // since the match always has a player, no player means no match
        if (res.rows.length == 0) {
            return {status:400, 
                result:{msg:"There is no match with that id"}}
        } else if(res.rows.length > 1) {
            return {status:400, 
                result:{msg:"That match is full"}}
        }
        let oId = res.rows[0].pm_id;
        sql = `insert into player_match (pm_player_id, pm_match_id, pm_state_id, pm_hp, pm_mana) 
               values ($1, $2, 2, 10, 1) returning *`;         
        res = await pool.query(sql,[pId,mId]);
        let pmId = res.rows[0].pm_id;
        // Create 2 random cards, you will draw one later
        this.createRandomCards(pmId, 44);
        this.getCardFromDeck(pmId, 5);
        return { status: 200, result: {msg: "You successfully joined the match",
                                        pmId: pmId, oId: oId} };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}