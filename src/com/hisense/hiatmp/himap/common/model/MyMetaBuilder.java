package com.hisense.hiatmp.himap.common.model;

import javax.sql.DataSource;

import com.jfinal.plugin.activerecord.generator.MetaBuilder;

public class MyMetaBuilder extends MetaBuilder{

	public MyMetaBuilder(DataSource dataSource) {
		super(dataSource);
	}
	
	/**
	 * 通过继承并覆盖此方法，跳过一些不希望处理的 table，定制更加灵活的 table 过滤规则
	 * @return 返回 true 时将跳过当前 tableName 的处理
	 */
	protected boolean isSkipTable(String tableName) {
		if(tableName.equalsIgnoreCase("sysparams") || tableName.equalsIgnoreCase("enum_type")){
			return false;
		}else{
			return true;
		}
	}
	
}
