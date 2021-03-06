
import DemoEntity from "./DemoEntity";
import KBEDebug from "../kbengine/KBEDebug";
import * as Datatypes from "../kbengine/DataTypes";


export default class DemoAccount extends DemoEntity
{
    static SCRIPT_NAME = "DemoAccount";

    set_dbidFromClient(oldval: any)
    {
        KBEDebug.INFO_MSG("Entity::set_dbidFromClient------------------->>>id:%d value:%s.", this.id, this["dbidFromClient"].toString());
        
    }

    set_wxnickname(oldval: any)
    {
        KBEDebug.INFO_MSG("Entity::set_wxnickname------------------->>>id:%d value:%s.", this.id, this["wxnickname"].toString());

        let data = Datatypes.BuildUINT64(15);
        this.BaseCall("pingBase", data);
    }

    pingBack(data: Datatypes.UINT64)
    {
        KBEDebug.INFO_MSG("Entity::pingBack------------------->>>id:%d value:%s.", this.id, data.toString());
    }
    
    receiveLoginAffiche(LOGIN_AFFICHE_DATA)
    {
        let title = LOGIN_AFFICHE_DATA["title"];
        let msg = LOGIN_AFFICHE_DATA["msg"];
        KBEDebug.INFO_MSG("Entity::receiveLoginAffiche------------------->>>title:%s.msg:%s.", title, msg);
    }
}

DemoAccount.RegisterScript(DemoAccount.SCRIPT_NAME, DemoAccount);
