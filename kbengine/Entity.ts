// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import * as KBEMath from "./KBEMath";
import {KBEngineApp} from "./KBEngine";
import KBEDebug from "./KBEDebug";
import * as EntityDef from "./EntityDef";
import { EntityCall } from "./EntityCall";

export default class Entity
{
    static SCRIPT_NAME = "Entity";  // 每个entity脚本都需要定义这个静态属性，用于注册entity脚本

    id: number;
    className: string;

    position: KBEMath.Vector3 = new KBEMath.Vector3(0, 0, 0);
    direction: KBEMath.Vector3 = new KBEMath.Vector3(0, 0, 0);
    entityLastLocalPos = new KBEMath.Vector3(0.0, 0.0, 0.0);
    entityLastLocalDir = new KBEMath.Vector3(0.0, 0.0, 0.0);

    inWord: boolean = false;
    inited: boolean = false;
    isControlled: boolean = false;
    isOnGround: boolean = false;

    cell: EntityCall;
    base: EntityCall;

    Name: string = "wsf";

    __init__()
    {
        this.inited = true;
    }

    CallPropertysSetMethods()
    {
        KBEDebug.DEBUG_MSG("Entity::CallPropertysSetMethods------------------->>>id:%s.", this.id);
        let module: EntityDef.ScriptModule = EntityDef.MODULE_DEFS[this.className];

        for(let name in module.propertys)
        {
            let property: EntityDef.Property = module.propertys[name];
            KBEDebug.DEBUG_MSG("Entity::CallPropertysSetMethods------------------->>>id:%s.name(%s), property(%s)", this.id, name, this[name]);
            let setmethod = module.GetScriptSetMethod(name);

            if(setmethod !== undefined)
            {
                if(property.IsBase())
                {
                    if(this.inited && !this.inWord)
                    {
                        let oldval = this[name];
                        setmethod.call(this, oldval)
                    }
                }
                else
                {
                    if(this.inWord)
                    {
                        if(property.IsOwnerOnly() || !this.IsPlayer())
                            continue;

                        let oldval = this[name];
                        setmethod.call(this, oldval)
                    }
                }
            }
        }
    }

    OnDestroy()
    {

    }

    OnControlled()
    {}

    IsPlayer(): boolean
    {
        return KBEngineApp.app.entity_id === this.id;
    }

    BaseCall(methodName: string, ...args: any[])
    {
        if(this.base === undefined)
        {
            KBEDebug.ERROR_MSG("Entity::BaseCall: entity(%d) base is undefined.", this.id);
        }

        let method: EntityDef.Method = EntityDef.MODULE_DEFS[this.className].baseMethods[methodName];
        if(method === undefined)
        {
            KBEDebug.ERROR_MSG("Entity::BaseCall: entity(%d) method(%s) not found.", this.id, methodName);
        }

        if(args.length !== method.args.length)
        {
            KBEDebug.ERROR_MSG("Entity::BaseCall: args(%d != %d) size is error!", args.length, method.args.length);  
			return;
        }

        this.base.NewCall();
        this.base.bundle.WriteUint16(method.methodUtype);

        try
        {
            for(let i = 0; i < args.length; i++)
            {
                if(method.args[i].IsSameType(args[i]))
                {
                    method.args[i].AddToStream(this.base.bundle, args[i])
                }
                else
                {
                    throw(new Error("KBEngine.Entity::baseCall: arg[" + i + "] is error!"));
                }
            }
        }
        catch(e)
        {
            KBEDebug.ERROR_MSG(e.tostring());
            KBEDebug.ERROR_MSG("KBEngine.Entity::baseCall: args is error!");
            this.base.bundle = undefined;
        }

        this.base.SendCall();
    }

    CellCall(methodName: string, ...args: any[])
    {
        if(this.cell === undefined)
        {
            KBEDebug.ERROR_MSG("Entity::CellCall: entity(%d) cell is undefined.", this.id);
        }

        let method: EntityDef.Method = EntityDef.MODULE_DEFS[this.className].cellMethods[methodName];
        if(method === undefined)
        {
            KBEDebug.ERROR_MSG("Entity::CellCall: entity(%d) method(%s) not found.", this.id, methodName);
        }

        if(args.length !== method.args.length)
        {
            KBEDebug.ERROR_MSG("Entity::CellCall: args(%d != %d) size is error!", args.length, method.args.length);  
			return;
        }

        this.cell.NewCall();
        this.cell.bundle.WriteUint16(method.methodUtype);

        try
        {
            for(let i = 0; i < args.length; i++)
            {
                if(method.args[i].IsSameType(args[i]))
                {
                    method.args[i].AddToStream(this.cell.bundle, args[i])
                }
                else
                {
                    throw(new Error("KBEngine.Entity::baseCall: arg[" + i + "] is error!"));
                }
            }
        }
        catch(e)
        {
            KBEDebug.ERROR_MSG(e.tostring());
            KBEDebug.ERROR_MSG("KBEngine.Entity::baseCall: args is error!");
            this.cell.bundle = undefined;
        }

        this.cell.SendCall();
    }

    EnterWorld()
    {
        this.OnEnterWorld();
    }

    OnEnterWorld()
    {
        KBEDebug.DEBUG_MSG("Entity::OnEnterWorld------------------->>>id:%s.", this.id);
    }

    LeaveWorld()
    {
        this.OnLeaveWorld();
    }

    OnLeaveWorld()
    {
        KBEDebug.DEBUG_MSG("Entity::OnLeaveWorld------------------->>>id:%s.", this.id);
    }

    EnterSpace()
    {
        this.OnEnterSpace();
    }

    OnEnterSpace()
    {
        KBEDebug.DEBUG_MSG("Entity::OnEnterSpace------------------->>>id:%s.", this.id);
    }

    LeaveSpace()
    {
        this.OnLeaveSpace();
    }

    OnLeaveSpace()
    {
        KBEDebug.DEBUG_MSG("Entity::OnLeaveSpace------------------->>>id:%s.", this.id);
    }

    OnUpdateVolatileData()
    {
        KBEDebug.DEBUG_MSG("Entity::OnUpdateVolatileData------------------->>>id:%s.", this.id);
    }

    Set_position(oldVal: KBEMath.Vector3)
    {}

    Set_direction(oldVal: KBEMath.Vector3)
    {}
}

