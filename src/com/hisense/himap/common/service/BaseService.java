package com.hisense.himap.common.service;

import java.util.List;

import com.hisense.himap.common.model.EnumType;
import com.hisense.himap.common.model.Sysparams;

public class BaseService {
	
	/**
	 * 获取系统参数
	 * @param paramcodes
	 * @return
	 */
	public List<Sysparams> getSysParam(String paramcodes) {
		try {
        	if(paramcodes!=null && paramcodes.length()>0){
    			String idcondition = paramcodes.replaceAll(",", "','");
    			idcondition = "'"+idcondition+"'";
    			String sql = "select * from sysparams p  where p.paramcode in("+idcondition+")";
    			List<Sysparams> list = Sysparams.dao.find(sql);
                return list;
    		}else{
    			return null;
    		}
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
	}
	
	/**
	 * 获取枚举值
	 * @param paramcodes
	 * @return
	 */
	public List<EnumType> getEnums(String enumtype) {
		try {
        	if(enumtype!=null && enumtype.length()>0){
    			String sql = "SELECT * from enum_type e WHERE e.enumtypeid="+enumtype;
    			List<EnumType> list = EnumType.dao.find(sql);
                return list;
    		}else{
    			return null;
    		}
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
	}
	
}
