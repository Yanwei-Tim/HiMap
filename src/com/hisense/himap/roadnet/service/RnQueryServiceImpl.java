package com.hisense.himap.roadnet.service;

import java.lang.reflect.Method;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


import com.hisense.himap.common.service.BaseService;
import com.hisense.himap.roadnet.model.Intersection;
import com.hisense.himap.roadnet.model.Lane;
import com.hisense.himap.roadnet.model.Road;
import com.hisense.himap.roadnet.model.Section;
import com.jfinal.kit.PropKit;
import com.jfinal.log.Log4jLog;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

@SuppressWarnings({ "unchecked", "rawtypes","static-access" })
public class RnQueryServiceImpl extends BaseService implements RnQueryService {
	
	private static final Log4jLog log = Log4jLog.getLog(RnQueryServiceImpl.class);
	
	private static final SimpleDateFormat SDF = new SimpleDateFormat( " yyyy-MM-dd HH:mm:ss " );
	//实体类型 0：道路 1：路段 2：信号路段 3：路口 4：车道
	public static String[] DTOTYPE = null;
	//public static List<IBean> DTOLIST = null;
	//public static  List<String> TRUSTSQLKEYS = null;
	
	public RnQueryServiceImpl(){
		DTOTYPE = PropKit.get("dtotype").split(",");
		/*TRUSTSQLKEYS = Arrays.asList(PropKit.get("trustkeys").split(","));
		DTOLIST = new ArrayList<IBean>();
		DTOLIST.add(Road.dao);
		DTOLIST.add(Section.dao);
		DTOLIST.add(UtcSection.dao);
		DTOLIST.add(Intersection.dao);
		DTOLIST.add(Lane.dao);*/
	}
	
	/**
     * 查询符合条件的记录
     * @param dtoType 实体类型 0：道路 1：路段 2：信号路段 3：路口 4：车道
     * @param rnRoad 查询实体类 本参数为根据道路模型类创建的对象。根据对象中的非空字段组合查询条件。
     *               如果有多个非空字段，取多个查询条件的交集;
     *               如果对象为空或对象所有字段为空，返回null;
     * @return 符合条件的道路列表，无记录返回空列表，异常返回null
     */
	public List<Record> queryRecordByDTO(int dtoType,Object dto){
		try {
			log.info("查询路网基础信息");
            //获取dto中非空参数
            Map<String,Object> params = getParamsFromDTO(dto);
            //组织查询条件
            String condition = genConditionByMap(params);
            String sql = "SELECT * from "+DTOTYPE[dtoType]+condition;
            System.out.println(sql);
            List<Record> result = Db.find(sql);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
	}
	
	public List queryRoadByDTO(Road rnRoad) {
		return this.queryRecordByDTO(0, rnRoad);
	}

	public List querySectionByDTO(Section rnSection) {
		return this.queryRecordByDTO(1, rnSection);
	}

	public List queryUTCSectionByDTO(Section rnSection) {
		return this.queryRecordByDTO(2, rnSection);
	}

	public List queryIntsByDTO(Intersection rnInts) {
		return this.queryRecordByDTO(3, rnInts);
	}

	public List queryLaneByDTO(Lane rnLane) {
		return this.queryRecordByDTO(4, rnLane);
	}

	public List queryAllRecord(int dtoType) {
		return this.queryRecordByDTO(dtoType, null);
	}

    /**
     * 跟据自定义sql语句查询指定类型的所有记录.
     * @param dtoType 实体类型 0：道路 1：路段 2：信号路段 3：路口 4：车道
     * @param sqlparam 自定义sql语句。
     *                语句中的关键字统一采用大写格式, 可用的关键字有：
     *                AND,OR,LIKE,(,),IS,NOT,NULL,', '<,>,<=,>=,=,ORDER,BY,GROUP BY,TO_DATE;
     *                字符串用单引号表达；
     *                日期统一采用“yyyy-mm-dd hh24:mi:ss”格式；
     *                如：roadname LIKE ‘%松岭%’ AND roadlength<=5000
     * @return 指定类型的所有记录，无记录返回空列表，异常返回null
     */
	public List queryRecordBySQL(int dtoType, String sqlparam) {
		System.out.println("自定义查询条件："+sqlparam);
		String[] untrustwords = new String[]{"delete","update","drop","truncate","create",";"};
		
		//根据查询类型生成可信赖的词语列表
		/*List<String> trustwords = new ArrayList<String>();
		IBean dto = this.DTOLIST.get(dtoType);
		Map<String,Method> fields = this.getFieldsFromDTO(dto);
		Iterator iter = fields.keySet().iterator();
		while(iter.hasNext()){
			String fieldname = iter.next().toString();
			trustwords.add(fieldname);
		}*/
		//trustwords.addAll(TRUSTSQLKEYS);
		
		//过滤关键字
		for(String untrustword :untrustwords){
			if(sqlparam.toLowerCase().indexOf(untrustword)>=0){
				return null;
			}
		}
		StringBuffer buff = new StringBuffer("select * from ").append(this.DTOTYPE[dtoType]).append(" where ");
		buff.append(sqlparam);
		try {
			List<Record> result = Db.find(buff.toString());
			return result;
		}catch(Exception e){
			e.printStackTrace();
			return null;
		}
	}

	
    /**
     * 从DTO中获取非空参数，用于组织查询语句
     * @param dto 封装查询条件的DTO
     * @return  返回DTO中非空参数与参数值
     * @throws Exception
     */
    public Map<String,Object> getParamsFromDTO(Object dto) throws Exception{
        Map<String,Object> result = new HashMap<String,Object>();
        Map<String,Method> fields = getFieldsFromDTO(dto);
        Iterator iter = fields.keySet().iterator();
        while(iter.hasNext()){
        	String fieldname = iter.next().toString();
        	Method method = fields.get(fieldname);
        	if(method.invoke(dto)!=null){
                result.put(fieldname,method.invoke(dto));
            }
        }
        return result;
    }
    
    public Map<String,Method> getFieldsFromDTO(Object dto){
    	 Map<String,Method> result = new HashMap<String,Method>();
         if(null == dto){
         	return result;
         }
 		Class cls = dto.getClass();
         String modelname = cls.getName().substring(cls.getName().lastIndexOf(".")+1);
         Method[] methods = cls.getMethods();
         for(Method method:methods){
         	String declarname = method.getDeclaringClass().getName();
             if(method.getName().startsWith("get") && (declarname.endsWith(modelname)||declarname.endsWith("Base"+modelname)) ){
                 String fieldname = method.getName().substring(3);
                 fieldname = fieldname.substring(0,1).toLowerCase()+fieldname.substring(1);
                 result.put(fieldname, method);
             }
         }
         return result;
    }
    
    /**
     * 组织查询条件
     * @param params 查询参数及参数值Map
     * @return 查询条件
     */
    private String genConditionByMap(Map<String,Object> params){
    	//组织查询条件
        StringBuffer condition = new StringBuffer(" where 1=1 ");
        Iterator<String> iter = params.keySet().iterator();
        while (iter.hasNext()){
            String key = iter.next().toString();
            Object kvalue = params.get(key);
            //采取模糊查询的字段
            if(key.equals("dlmc") || key.equals("sectionname")|| key.equals("lkmc")|| key.equals("nextsection")){
                condition.append(" and ").append(key).append(" like '%").append(kvalue).append("%'");
            }else{
            	genConditionByType(key,kvalue);
            }
        }
        return condition.toString();
    }
    
    /**
     * 根据参数类型生成查询条件
     * @param key 参数
     * @param kvalue 参数值
     * @return 查询条件
     */
    private String genConditionByType(String key,Object kvalue){
    	StringBuffer condition = new StringBuffer();
    	if(kvalue instanceof String){
            condition.append(" and ").append(key).append("='").append(kvalue).append("'");
        } else if(kvalue instanceof Integer){
            condition.append(" and ").append(key).append("=").append(kvalue);
        }else if(kvalue instanceof Date){
            condition.append(" and ").append(key).append("=to_date('").append(SDF.format(kvalue)).append("','YYYY-MM-DD HH24:mi:ss')");
        }
    	return condition.toString();
    	
    }
    


}
