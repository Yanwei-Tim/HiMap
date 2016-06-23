package com.hisense.hiatmp.himap.mapindex.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.hisense.hiatmp.himap.mapindex.model.BaseMarkerVO;
import com.hisense.hiatmp.himap.mapindex.model.MarkerVO;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Envelope;
import com.vividsolutions.jts.index.kdtree.KdNode;
import com.vividsolutions.jts.index.kdtree.KdTree;

public class HiKdTree extends KdTree {
	

	
	public KdNode root = null;
	public long numberOfNodes;
	public Double tol;
	public List<KdNode> nodelist = new ArrayList<KdNode>();
	
	public HiKdTree() {
		super();
		this.tol = 0d;
	}
	
	public HiKdTree(double tolerance) {
		//super(tolerance);
		this.tol = tolerance;
	}
	
	public KdNode insert(Coordinate p, Object data) {
		KdNode node = searchTolNode(p,this.root);
		if(node!=null){
			MarkerVO vo = (MarkerVO)node.getData();
			if(vo.getMarkermultinfo()==null){
				vo.setMarkermultinfo(new HashMap<String,List>());
				List<String> pointList = new ArrayList<String>();
				pointList.add(vo.getId());
				vo.getMarkermultinfo().put("points", pointList);
			}
			List<String> pointList = vo.getMarkermultinfo().get("points");
			pointList.add(((MarkerVO)data).getId());
		}else{
			node = super.insert(p,data);
			numberOfNodes++;
			nodelist.add(node);
		}
		return node;
		
		/*KdNode node = super.insert(p,data);
		if(node.getCount()>1){
			MarkerVO vo = (MarkerVO)node.getData();
			if(vo.getMarkermultinfo()==null){
				vo.setMarkermultinfo(new HashMap<String,List>());
				List<String> pointList = new ArrayList<String>();
				pointList.add(vo.getId());
				vo.getMarkermultinfo().put("points", pointList);
			}
			List<String> pointList = vo.getMarkermultinfo().get("points");
			pointList.add(((MarkerVO)data).getId());
		}else{
			numberOfNodes++;
			nodelist.add(node);
		}
		return node;*/
	}
	
	public KdNode searchTolNode(Coordinate p,KdNode currentNode){
		KdNode tolNode = null;
		if(currentNode == null){
			return null;
		}
		boolean isInTolerance = p.distance(currentNode.getCoordinate()) <= tol;
		if(isInTolerance){return currentNode;}
		tolNode = searchTolNode(p,currentNode.getLeft());
		if(tolNode!=null){
			return tolNode;
		}else{
			return searchTolNode(p,currentNode.getRight());
		}
		
		/*Envelope env = new Envelope(new Coordinate(p.x-tol,p.y-tol),new Coordinate(p.x+tol,p.y+tol));
		List<KdNode> nodelist = this.query(env);
		if(nodelist!=null && nodelist.size()>0){
			return nodelist.get(0);
		}else{
			return null;
		}*/
	}
	
	
	/**
	 * K近邻搜索
	 * @param point 查询节点
	 * @param maxNodes 查询最大条数
	 * @param maxDistance 最大距离
	 * @return
	 */
	public List nearest(KdNode point, int maxNodes, Double maxDistance){
		return null;
	}
	
	/**
	 * 遍历所有节点
	 * @return
	 */
	public List<KdNode> reportSubTree(){
		return reportSubTree(root);
	}
	
	/**
	 * 遍历某节点
	 * @param node
	 * @return
	 */
	public List reportSubTree(KdNode node){
		return nodelist; 
	}
	
	/**
	 * 遍历所有节点
	 * @return
	 */
	public List<KdNode> reportSubTreeData(){
		List result = new ArrayList();
		for(KdNode subnode:nodelist){
			MarkerVO marker = (MarkerVO)subnode.getData();
			BaseMarkerVO basemarker = new BaseMarkerVO();
			basemarker.setId(marker.getId());
			basemarker.setTitle(marker.getTitle());
			basemarker.setLongitude(marker.getLongitude());
			basemarker.setLatitude(marker.getLatitude());
			basemarker.setMarkerinfo(marker.getMarkerinfo());
			result.add(basemarker);
		}
		return result;
	}
	
	/**
	 * 遍历某节点
	 * @param node
	 * @return
	 */
	public List reportSubTreeData(KdNode node){
		
		if(node == null){
			node = root;
		}
		
		List result = new ArrayList();
		/*MarkerVO marker = (MarkerVO)node.getData();
		BaseMarkerVO basemarker = new BaseMarkerVO();
		basemarker.setId(marker.getId());
		basemarker.setTitle(marker.getTitle());
		basemarker.setLongitude(marker.getLongitude());
		basemarker.setLatitude(marker.getLatitude());
		basemarker.setMarkerinfo(marker.getMarkerinfo());*/
		
		result.add(node.getData());
		if(node.getLeft()!=null){
			result.addAll(reportSubTree(node.getLeft()));
		}
		if(node.getRight()!=null){
			result.addAll(reportSubTree(node.getRight()));
		}
		return result; 
	}

}
