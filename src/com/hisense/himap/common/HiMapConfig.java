package com.hisense.himap.common;

import com.hisense.himap.common.web.BaseController;
import com.hisense.himap.roadnet.model._MappingKit;
import com.hisense.himap.roadnet.web.RnEditController;
import com.hisense.himap.roadnet.web.RnQueryController;
import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.kit.PropKit;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.activerecord.CaseInsensitiveContainerFactory;
import com.jfinal.plugin.activerecord.dialect.OracleDialect;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.jfinal.plugin.c3p0.C3p0Plugin;


public class HiMapConfig extends JFinalConfig {

	public void configConstant(Constants me) {
		PropKit.use("himap.properties");
		me.setDevMode(PropKit.getBoolean("devMode",false));
	}

	public void configRoute(Routes me) {
		me.add("/",BaseController.class);
		me.add("/roadnet/query",RnQueryController.class);
		me.add("/roadnet/edit",RnEditController.class);
	}

	@Override
	public void configPlugin(Plugins me) {
		// 配置C3p0数据库连接池插件
		C3p0Plugin c3p0Plugin = new C3p0Plugin(PropKit.get("jdbcUrl"), PropKit.get("user"), PropKit.get("password").trim());
		me.add(c3p0Plugin);

		// 配置ActiveRecord插件
		ActiveRecordPlugin arp = new ActiveRecordPlugin(c3p0Plugin);
		// 绑定表与Model
		com.hisense.himap.common.model._MappingKit.mapping(arp);
		com.hisense.himap.roadnet.model._MappingKit.mapping(arp);
		me.add(arp);

		c3p0Plugin.setDriverClass("oracle.jdbc.driver.OracleDriver");
		arp.setDialect(new OracleDialect());
		// oracle 会把字段都转换成大写，为了能从Model中得到数据，需要配置大小写不敏感
		arp.setContainerFactory(new CaseInsensitiveContainerFactory());
		
	}

	@Override
	public void configInterceptor(Interceptors me) {
		// TODO Auto-generated method stub
		//me.add(new Tx());
	}

	@Override
	public void configHandler(Handlers me) {
		// TODO Auto-generated method stub
		
	}

}
