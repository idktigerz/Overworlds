const pool = require('./connection.js');

module.exports.resetDatabase = async function(){
    try { 
        let sql = `truncate table card_state, card_type, cards, deck, matches, player_match, pm_state, users restart identity`
        let result = await pool.query(sql);
        if (result.rows.length == 0 ){
            let card_typeSql = `insert into "card_type" ("tp_id", "tp_name") values (1, 'Monster');
                                insert into "card_type" ("tp_id", "tp_name") values (2, 'Spell');`
            await pool.query(card_typeSql);

            let card_stateSql = `insert into "card_state" ("st_id", "st_name") values (1, 'Deck');
                                insert into "card_state" ("st_id", "st_name") values (2, 'Hand');
                                insert into "card_state" ("st_id", "st_name") values (3, 'Board');
                                insert into "card_state" ("st_id", "st_name") values (4, 'Discard');
                                insert into "card_state" ("st_id", "st_name") values (5, 'Life');`
            await pool.query(card_stateSql); 

            let player_stateSql = `insert into "pm_state" ("pms_id", "pms_name") values (1, 'Draw');
                                insert into "pm_state" ("pms_id", "pms_name") values (2, 'Setup');
                                insert into "pm_state" ("pms_id", "pms_name") values (3, 'Battle');
                                insert into "pm_state" ("pms_id", "pms_name") values (4, 'Wait');`
            await pool.query(player_stateSql);

            let cardSql = `insert into "cards" ("crd_atk", "crd_cost", "crd_dsc", "crd_img", "crd_name", "crd_stk", "crd_tp_id", "crd_hp") values (0, 1, 'Description', './assets/images/raidron.png', 'Raidron', 1, 1, 1);
                        insert into "cards" ("crd_atk", "crd_cost", "crd_dsc", "crd_img", "crd_name", "crd_stk", "crd_tp_id", "crd_hp") values (1, 3, 'Description', './assets/images/salvagetron.png', 'Salvagetron', 1, 1, 2);
                        insert into "cards" ("crd_atk", "crd_cost", "crd_dsc", "crd_img", "crd_name", "crd_stk", "crd_tp_id", "crd_hp") values (0, 5, 'Description', './assets/images/vicecron.png', 'Vicecron', 2, 1, 6);
                        insert into "cards" ("crd_atk", "crd_cost", "crd_dsc", "crd_img", "crd_name", "crd_stk", "crd_tp_id", "crd_hp") values (1, 3, 'Description', './assets/images/rno.png', 'R-no', 1, 1, 3);
                        insert into "cards" ("crd_atk", "crd_cost", "crd_dsc", "crd_img", "crd_name", "crd_stk", "crd_tp_id", "crd_hp") values (2, 7, NULL, './assets/images/dya.png', 'D-ya', 2, 1, 7);
                        insert into "cards" ("crd_atk", "crd_cost", "crd_dsc", "crd_img", "crd_name", "crd_stk", "crd_tp_id", "crd_hp") values (2, 2, NULL, './assets/images/miru.png', 'Miru', 2, 1, 2);`
            await pool.query(cardSql);

            let userSql = `insert into "users" ("usr_name", "usr_passwd") values ('admin', 'admin');
                           insert into "users" ("usr_name", "usr_passwd") values ('Tomas', 'tomas');
                           insert into "users" ("usr_name", "usr_passwd") values ('Bruno', 'bruno');`;
            await pool.query(userSql);
            return {status: 200, result: {msg: "Database reset"}}
        }else{
            return {status: 400, result: {msg: "Cannot reset the database"}}
        }
            
    } catch (err) {
        console.log(err);
        return{ status: 500, result: err}
    }
};