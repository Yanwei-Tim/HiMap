package com.hisense.hiatmp.himap.roadnet.service;


import com.hisense.hiatmp.himap.common.util.GISUtils;
import com.hisense.hiatmp.himap.roadnet.astar.IGoalNode;
import com.hisense.hiatmp.himap.roadnet.astar.ISearchNode;

/**
 * Created by lxb on 2015-5-6.
 */
public class RouteGoalNode implements IGoalNode {
    private double x;
    private double y;

    public RouteGoalNode(Double x,Double y){
        this.x = x;
        this.y = y;

    }


    public boolean inGoal(ISearchNode other) {
        if(other instanceof RouteSearchNode){
            RouteSearchNode otherNode = (RouteSearchNode) other;
            String strcoords = this.x+","+this.y+","+otherNode.getX()+","+otherNode.getY();
            Boolean isgoal = (GISUtils.getRoadLength(strcoords)<=20);
            //System.out.println(isgoal+"--"+GISUtils.getRoadLength(strcoords));
            return isgoal;
        }
        return false;
    }


    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

}
