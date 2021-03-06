var pool = require('./connection.js');
var cModel = require('./cardsModel.js');

module.exports.getMatchOfPlayer = async function (pmId) {
    try {
        let sqlCheck = `select * from matches, player_match
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
        if (player.pm_state_id != 3 || player.pm_played == true)
            return { status: 400, result: { msg: "You cannot attack at this moment" } };
        
        res = await this.getPlayerDeckCard(pmId,deckId)
        if (res.status != 200) return res;
        let card = res.result;
        if (card.dk_st_id != 3 || card.dk_crd_played == true)
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
        // remove 1 from opponent life
        res = await cModel.getCardByIDInDeck(deckId);
        if (res.status != 200) return res;
        let cardStk = res.result.rows[0].crd_stk;
        console.log(cardStk);
        let sqlUpHp = `update player_match set pm_hp = $1
                        where pm_id = $2`
        await pool.query(sqlUpHp, [opponent.pm_hp - cardStk, opPmId]);

        let sql = `select dk_id from deck where dk_st_id = 1 and dk_pm_id = $1
        order by random()
        LIMIT 1`;
        res = await pool.query(sql, [opPmId]);
        let cardId = res.rows[0].dk_id;
        sql = `update deck set dk_st_id = 2 where dk_pm_id = $1 and dk_id = $2 returning *`;         
        await pool.query(sql,[opponent.pm_id, cardId]);
        let sqlUpCardPlayed = `update deck set dk_crd_played = true where dk_id = $1`
        await pool.query(sqlUpCardPlayed, [deckId]);
        return {status:200, result: {msg: "Successfully removed HP from the opponent "}}
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
        if (player.pm_state_id != 3 || player.pm_played == true){
            return { status: 400, result: { msg: "You cannot attack at this moment" } };
        } 
        // get player deck card info
        res = await this.getPlayerDeckCard(pmId,deckId)
        if (res.status != 200) return res;
        let card = res.result;
        if (card.dk_st_id != 3 || card.dk_crd_player == true)
            return { status: 400, result: { msg: "The card cannot attack at this moment" } };
        // get opponent info
        let matchId = player.pm_match_id;
        res = await this.getOpponent(pmId,matchId);
        if (res.status != 200) return res;
        let opponent = res.result;
        let opPmId = opponent.pm_id;
        
        res = await this.getPlayerDeckCard(opPmId, opDeckId, "opponent");
        if (res.status != 200) return res;
        let opCard = res.result;     
        if ((opCard.dk_st_id != 3) || opCard.dk_hp <= 0)
            return { status: 400, result: { msg: "You can only attack cards on the table with HP higher or equal to zero." } };

        res = await cModel.getCardByIDInDeck(deckId);
        if (res.status != 200) return res;
        let cards = res.result.rows[0];
        let sqlDamage = `update deck set dk_crd_hp = $1
                      where dk_id = $2`
        await pool.query(sqlDamage, [opCard.dk_crd_hp - cards.crd_atk, opDeckId]);
        let sqlUpCardPlayed = `update deck set dk_crd_played = true where dk_id = $1`
        await pool.query(sqlUpCardPlayed, [deckId]);
        return {status: 200, result:{msg: "Card attacked"}};

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
        res = await this.getMatchOfPlayer(pmId);
        if (res.status != 200) return res;
        let match = res.result;
        // Set player match states
        let sqlUpState = `update player_match set pm_state_id = $1 
                          where pm_id = $2`;
        // the opponent has not yet played
        if (opponent.pm_state_id == 2) {
            await pool.query(sqlUpState, [4, pmId]);
        }else if (opponent.pm_state_id == 4 && opponent.pm_played == false && player.pm_state_id == 2) {
            let randPlayer =  Math.floor(Math.random() * 2);
            if (randPlayer == 1){
                await pool.query(sqlUpState, [3, pmId]);
                await pool.query(sqlUpState, [4, opponent.pm_id]);
            }else if (randPlayer == 0){
                await pool.query(sqlUpState, [3, opponent.pm_id]);
                await pool.query(sqlUpState, [4, pmId]);
            } 
        }else if (opponent.pm_state_id == 4 && opponent.pm_played == false && player.pm_state_id == 3){
            let sqlUpPlayed = `update player_match set pm_played = true where pm_id = $1`;
            await pool.query(sqlUpPlayed, [pmId]);
            
            await pool.query(sqlUpState, [4, pmId]);
            await pool.query(sqlUpState, [3, opponent.pm_id]);

        }else if (opponent.pm_state_id == 4 && opponent.pm_played == true && player.pm_played == false){
            await pool.query(sqlUpState, [2, pmId]);
            await pool.query(sqlUpState, [2, opponent.pm_id]);

            let sqlUpPlayed = `update player_match set pm_played = false where pm_id = $1`;
            await pool.query(sqlUpPlayed, [pmId]);
            await pool.query(sqlUpPlayed, [opponent.pm_id]);

            let sqlUpMtcTurn = `update matches set mtc_turn = $1 where mtc_id = $2`
            await pool.query(sqlUpMtcTurn, [match.mtc_turn + 1, matchId]);

            let sqlUpPlayerMana = `update player_match set pm_mana = $1 where pm_id = $2`;
            await pool.query(sqlUpPlayerMana, [player.pm_mana + match.mtc_turn, player.pm_id]);
            await pool.query(sqlUpPlayerMana, [opponent.pm_mana + match.mtc_turn, opponent.pm_id]);

            if (player.pm_mana >= 10){
                await pool.query(sqlUpPlayerMana, [10, player.pm_id]);
            }else if (opponent.pm_mana >= 10){
                await pool.query(sqlUpPlayerMana, [10, opponent.pm_id]);
            }
            this.getCardFromDeck(pmId);
            this.getCardFromDeck(opponent.pm_id);

        }else if (opponent.pm_state_id == 4 && opponent.pm_played == true && player.pm_played == true){
            await pool.query(sqlUpState, [2, pmId]);
            await pool.query(sqlUpState, [2, opponent.pm_id]);

            let sqlUpPlayed = `update player_match set pm_played = false where pm_id = $1`;
            await pool.query(sqlUpPlayed, [pmId]);
            await pool.query(sqlUpPlayed, [opponent.pm_id]);

            let sqlUpMtcTurn = `update matches set mtc_turn = $1 where mtc_id = $2`
            await pool.query(sqlUpMtcTurn, [match.mtc_turn + 1, matchId]);

            let sqlUpPlayerMana = `update player_match set pm_mana = $1 where pm_id = $2`;
            await pool.query(sqlUpPlayerMana, [player.pm_mana + (match.mtc_turn - 1), player.pm_id]);
            await pool.query(sqlUpPlayerMana, [opponent.pm_mana + (match.mtc_turn - 1) , opponent.pm_id]);

            if (player.pm_mana >= 10){
                await pool.query(sqlUpPlayerMana, [10, player.pm_id]);
            }else if (opponent.pm_mana >= 10){
                await pool.query(sqlUpPlayerMana, [10, opponent.pm_id]);
            }
            this.getCardFromDeck(pmId);
            this.getCardFromDeck(opponent.pm_id);
        } 
        
        else {
            return { status: 500, result: { msg: "Current state of the players in the match is not valid" } }
        }
        // Check for end game condition
        if (opponent.pm_hp <= 0 ) {
            let sqlEnd = `Update matches set mtc_finished = true
                          Where mtc_id = $1`;
            await pool.query(sqlEnd, [matchId]);
            let sqlWinner = `update matches set mtc_winner = $1 where mtc_id = $2`
            await pool.query(sqlWinner, [player.pm_player_id, matchId]);
            return { status: 200, result: { msg: "Game Ended" } };

        }else if (player.pm_hp <= 0){
            let sqlEnd = `Update matches set mtc_finished = true
            Where mtc_id = $1`;
            await pool.query(sqlEnd, [matchId]);
            let sqlWinner = `update matches set mtc_winner = $1 where mtc_id = $2`
            await pool.query(sqlWinner, [opponent.pm_player_id, matchId]);
            return { status: 200, result: { msg: "Game Ended" } };
        }
        
        let sqlDeck = `update deck set dk_st_id = 4
                           where (dk_pm_id = $1 or dk_pm_id = $2)  
                           and dk_crd_hp <= 0`;
        await pool.query(sqlDeck, [pmId, opponent.pm_id]);
        let sqlCardPlayedUp = `update deck set dk_crd_played = false where dk_crd_played = true`;
        await pool.query(sqlCardPlayedUp);
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
        if (player.pm_state_id != 2) 
            return {status:400, result: {msg:"Cannot play a card at this moment"}};        
        res =  await this.getPlayerDeckCard(pmId,deckId);
        if (res.status != 200) return res;
        let playerCard = res.result;
        if (playerCard.dk_st_id != 2){
            return {status:400, result: {msg:"That card is not on the hand to be played"}};
        }
        let result = await cModel.getCardByIDInDeck(deckId);
        let card = result.result.rows[0];
        if (player.pm_mana < card.crd_cost) {
            return {status:400, result: {msg:"You do not have enough mana to playe the card"}};
        }
        let sqlUpCard = `update deck set dk_st_id = 3
                             where dk_id = $1`;
        await pool.query(sqlUpCard, [deckId]);
        let sqlUpMana = `update player_match set pm_mana = $1 where pm_id = $2`;
        await pool.query(sqlUpMana, [player.pm_mana - card.crd_cost, pmId]);
        return { status:200, result: {msg:"Card was successfully played on the table"} };
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
            st_name, crd_name, crd_atk, crd_stk, crd_cost, crd_img
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
            st_name, crd_name, crd_atk, crd_stk, crd_cost, crd_img
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
        let sql = `select pm_id, pm_state_id, pm_hp, pm_mana, pm_played, pms_name, mtc_turn, mtc_finished, mtc_current_player, mtc_winner, usr_name, usr_id  
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

module.exports.register = async function (username, password) {
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
            sql = `Insert into users(usr_name, usr_passwd) values($1, $2)`;
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
            res = await cModel.getCardHPByID(cardId);
            let cardHp = res.result.rows[0].crd_hp;
            sql = `insert into deck (dk_pm_id, dk_st_id, dk_crd_id, dk_crd_hp, dk_crd_played) 
                    values ($1, 1, $2, $3, false) returning *`;         
            await pool.query(sql,[pmId, cardId, cardHp]);
        }
        this.getCardFromDeck(pmId);
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
                let sql = `select dk_id from deck where dk_st_id = 1 and dk_pm_id = $1 order by random() LIMIT 1`;
                let result = await pool.query(sql, [pmId]);
                let cardId = result.rows[0].dk_id;
                sql = `update deck set dk_st_id = 2 where dk_pm_id = $1 and dk_id = $2 returning *`;         
                await pool.query(sql,[pmId,cardId]);
            }
        }else{
            for(let i=0; i < 1; i++) {
                let sql = `select dk_id from deck where dk_st_id = 1 and dk_pm_id = $1
                       order by random()
                       LIMIT 1`;
                let result = await pool.query(sql, [pmId]);
                let cardId = result.rows[0].dk_id;
                sql = `update deck set dk_st_id = 2 where dk_pm_id = $1 and dk_id = $2 returning *`;         
                await pool.query(sql,[pmId, cardId]);
            }
        }
        return { status: 200, result: {msg: "Succesufully got cards from deck"}}
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
            sql = `insert into player_match (pm_player_id, pm_match_id, pm_state_id, pm_hp, pm_mana, pm_played) 
               values ($1, $2, 2, 10, 3, false) returning *`;         
            res = await pool.query(sql,[pId, matchId]);
            let pmId = res.rows[0].pm_id;
            this.createRandomCards(pmId, 44);
            //this.getCardFromDeck(pmId);
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
        sql = `insert into player_match (pm_player_id, pm_match_id, pm_state_id, pm_hp, pm_mana, pm_played) 
               values ($1, $2, 2, 10, 3, false) returning *`;         
        res = await pool.query(sql,[pId,mId]);
        let pmId = res.rows[0].pm_id;
        this.createRandomCards(pmId, 44);
        //this.getCardFromDeck(pmId);
        return { status: 200, result: {msg: "You successfully joined the match",
                                        pmId: pmId, oId: oId} };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

module.exports.killOpponent = async function(pmId){
    try {
        let res = await this.getPlayerMatch(pmId);
        if (res.status != 200) return res;
        let player = res.result;
        let matchId = player.pm_match_id;
        console.log(matchId)
        res = await this.getOpponent(pmId, matchId);
        if (res.status != 200) return res;
        let opponent = res.result;

        let sql = `update player_match set pm_hp = 0 where pm_id = $1`;
        await pool.query(sql, [opponent.pm_id]);

        return { status: 200, result: { msg: "Press End Turn to end the match " } };
    } catch (err) {
        console.log(err);
        return { status: 500, result: err };
    }
}

