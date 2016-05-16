package com.hisense.himap.roadnet.service;


import com.hisense.himap.common.util.GISUtils;
import com.hisense.himap.roadnet.astar.ASearchNode;
import com.hisense.himap.roadnet.astar.ISearchNode;
import com.hisense.himap.roadnet.model.Arc;
import com.hisense.himap.roadnet.model.Node;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by lxb on 2015-5-6.
 */

public class RouteSearchNode extends ASearchNode {
	
	private Node node;
	private Arc arc;
    private double x;
    private double y;
    private RouteSearchNode parent;
    private RouteGoalNode goal;
    private double distance;
    private String strcoords;
    private static double _C_P = 0.0174532925199432957692222222222;

    public RouteSearchNode(Node node,Arc arc,RouteSearchNode parent,RouteGoalNode goal){
        this.node = node;
        this.arc = arc;
        this.parent = parent;
        this.goal = goal;
        String nodestr = node.getStrcoords();
        if(arc != null){
        	String strcoords = arc.getStrcoords();
        	if(arc.getStartnode().equalsIgnoreCase(node.getNodeid())){
        		nodestr = strcoords.split(",")[0]+","+strcoords.split(",")[1];
        		this.strcoords = GISUtils.resetDirection(arc.getStrcoords());
        	}else{
        		nodestr = strcoords.split(",")[strcoords.split(",").length-2]+","+strcoords.split(",")[strcoords.split(",").length-1];
        		this.strcoords = arc.getStrcoords();
        	}
        	this.distance = arc.getArclength().doubleValue();
        }
        this.x = Double.parseDouble(nodestr.split(",")[0]);
        this.y = Double.parseDouble(nodestr.split(",")[1]);

    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public String getStrcoords() {
        return strcoords;
    }

    public void setStrcoords(String strcoords) {
        this.strcoords = strcoords;
    }

    public double h() {
        return this.dist(goal.getX(), goal.getY());
    }

    public double dist(double otherX, double otherY) {

        double dlon = (otherX - this.x) * _C_P;
        double dlat = (otherY - this.y) * _C_P;
        double a = Math.sin(0.5 * dlat) * Math.sin(0.5 * dlat) + Math.cos(this.y * _C_P) * Math.cos(otherY * _C_P) * (Math.sin(0.5 * dlon) * Math.sin(0.5 * dlon));
        a = Math.abs(a);
        if (a > 1) {
            //alert("不合法数据:" + "a:" + a + ",P1:" + p1.toString() + ",P2:" + p2.toString());
        }
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double d = c * 6371008.77141506;
        //System.out.println("distance:"+this.getDistance()+"---"+d);
        return d;
//        return 0;
        //return Math.sqrt(Math.pow(this.x - otherX, 2) + Math.pow(this.y - otherY, 2));
    }

    
    public double c(ISearchNode successor) {
        if(successor instanceof RouteSearchNode){
            RouteSearchNode searchNode = (RouteSearchNode) successor;
            return searchNode.getDistance();
        }
        return 0;
    }

    
    public ArrayList<ISearchNode> getSuccessors() {

        ArrayList<ISearchNode> successors = new ArrayList<ISearchNode>();
        List<Arc> arclist = new ArrayList<Arc>();
        if(this.parent == null){
        	arclist = MemRouteData.getArcByStartNode(node.getNodeid(),null);
        }else{
        	arclist = MemRouteData.getArcByStartNode(node.getNodeid(),this.parent.node.getNodeid());
        }
        if(arclist != null){
        	for(Arc arc:arclist){
                if(arc.getStartnode().equalsIgnoreCase(arc.getEndnode())){
                    continue;
                }
                String nextnodeid = arc.getEndnode().equalsIgnoreCase(node.getNodeid())?arc.getStartnode():arc.getEndnode();
                Node node = MemRouteData.getNodeById(nextnodeid);

                RouteSearchNode searchNode = new RouteSearchNode(node,arc,this,this.goal);
                successors.add(searchNode);
            }
        }
        return successors;
    }

    
    public ISearchNode getParent() {
        return this.parent;
    }

    
    public void setParent(ISearchNode parent) {
        this.parent = (RouteSearchNode) parent;
    }



    
    public Integer keyCode() {
        return this.toString().hashCode();
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public void setParent(RouteSearchNode parent) {
        this.parent = parent;
    }

    public RouteGoalNode getGoal() {
        return goal;
    }

    public void setGoal(RouteGoalNode goal) {
        this.goal = goal;
    }

    public double getDistance() {
        return distance;
    }
    public String toString(){
        String x = Double.toString(this.getX());
        String y = Double.toString(this.getY());
        if(x.split("\\.")[1].length()<4){
            for(int i=0;i<4-x.split("\\.")[1].length();i++){
                x = x+"0";
            }
        }
        if(y.split("\\.")[1].length()<5){
            for(int i=0;i<5-y.split("\\.")[1].length();i++){
                y = y+"0";
            }
        }
//        return x+","+y;
        if(this.arc == null){
        	return this.node.getNodeid();
        }else{
        	return this.node.getNodeid()+"--"+this.arc.getArcid();
        }
    }
    
    public Arc getArc() {
		return arc;
	}

	public void setArc(Arc arc) {
		this.arc = arc;
	}
	

	public Node getNode() {
		return node;
	}

	public void setNode(Node node) {
		this.node = node;
	}

	public boolean equals(RouteSearchNode other){
    	if(this.node.getNodeid().equalsIgnoreCase(other.node.getNodeid()) && this.arc.getArcid().equalsIgnoreCase(other.arc.getArcid())){
    		return true;
    	}else{
    		return false;
    	}
    	
    }
}
