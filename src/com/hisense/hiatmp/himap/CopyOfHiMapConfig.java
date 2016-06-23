package com.hisense.hiatmp.himap;

import com.hisense.hiatmp.framework.IVersion;
import com.hisense.hiatmp.framework.jfinal.HiatmpConfig;
import com.hisense.hiatmp.framework.remoteservice.IRemoteService;
import com.hisense.hiatmp.himap.common.globalmem.MemDevice;
import com.hisense.hiatmp.himap.common.web.BaseController;
import com.hisense.hiatmp.himap.mapindex.web.MapIndexController;
import com.hisense.hiatmp.himap.mapquery.web.MapQueryController;
import com.hisense.hiatmp.himap.roadnet.web.RnAnalyController;
import com.hisense.hiatmp.himap.roadnet.web.RnEditController;
import com.hisense.hiatmp.himap.roadnet.web.RnQueryController;
import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.core.JFinal;
import com.jfinal.kit.PropKit;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.activerecord.CaseInsensitiveContainerFactory;
import com.jfinal.plugin.activerecord.dialect.OracleDialect;
import com.jfinal.plugin.c3p0.C3p0Plugin;


public class CopyOfHiMapConfig extends HiatmpConfig {

	public void configConstant(Constants me) {
		super.configConstant(me);
	}

	public void configRoute(Routes me) {
		super.configRoute(me);
		
		int runMode = PropKit.getInt("runMode");
		me.add("/",BaseController.class);
		me.add("/HiMap",BaseController.class);
		if(runMode == 1){
			
		}else if(runMode == 2){
			me.add("/query",MapQueryController.class);
			me.add("/roadnet/query",RnQueryController.class);
			me.add("/roadnet/analy",RnAnalyController.class);
			me.add("/roadnet/edit",RnEditController.class);
		}else if(runMode == 3){
			me.add("/query",MapQueryController.class);
			me.add("/mapindex",MapIndexController.class);
			me.add("/roadnet/query",RnQueryController.class);
			me.add("/roadnet/analy",RnAnalyController.class);
			me.add("/roadnet/edit",RnEditController.class);
		}
		
	}
	

	@Override
	public void configPlugin(Plugins me) {
		int runMode = PropKit.getInt("runMode");
		if(runMode == 2 || runMode == 3){
			super.configPlugin(me);
			
			/*// 配置C3p0数据库连接池插件
			C3p0Plugin c3p0Plugin = new C3p0Plugin(PropKit.get("jdbcUrl"), PropKit.get("user"), PropKit.get("password").trim());
			me.add(c3p0Plugin);
			// 配置ActiveRecord插件
			ActiveRecordPlugin arp = new ActiveRecordPlugin(c3p0Plugin);
			me.add(arp);
			c3p0Plugin.setDriverClass("oracle.jdbc.driver.OracleDriver");
			arp.setDialect(new OracleDialect());
			// oracle 会把字段都转换成大写，为了能从Model中得到数据，需要配置大小写不敏感
			arp.setContainerFactory(new CaseInsensitiveContainerFactory(true));*/
		}
	}

	/**
	 * 配置全局拦截器
	 */
	public void configInterceptor(Interceptors me) {
		super.configInterceptor(me);
	}

	
	//启动任务
	public void afterJFinalStart() {
		int runMode = PropKit.getInt("runMode");
		if(runMode == 2 || runMode == 3){
			MemDevice memDevice = new MemDevice();
			memDevice.initMonitors();
		}
		super.afterJFinalStart();
	}
	
	/**
	 * 建议使用 JFinal 手册推荐的方式启动项目 运行此 main
	 * 方法可以启动项目，此main方法可以放置在任意的Class类定义中，不一定要放于此
	 */
	public static void main(String[] args) {
		JFinal.start("WebRoot", 80, "/HiMap", 5);
	}

	// 绑定表与Model
	public void addDbTableMapping(ActiveRecordPlugin arg0) {
		com.hisense.hiatmp.himap.common.model._MappingKit.mapping(arg0);
		com.hisense.hiatmp.himap.roadnet.model._MappingKit.mapping(arg0);
	}

	@Override
	protected IVersion createVersion() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Class<?>[] getFlexServices() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public String getPropertyFileName() {
		return "himap.properties";
	}
	
	@Override
	public void exportRemoteService(IRemoteService remoteService) {
	}

}
