package com.hisense.himap.common.util;

import java.util.ArrayList;
import java.util.List;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.LineString;
import com.vividsolutions.jts.geom.PrecisionModel;

public class test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(),8307);
		LineString line = GISUtils.genLineString("1,1,2,2,3,3,5,5");
		LineString line2 = GISUtils.genLineString("4,4,4,4");
		Geometry geom = line.symDifference(geometryFactory.createPoint(new Coordinate(4,4)));
		//geom = line.union(line2);
		List<String> points = new ArrayList<String>();
		points.add("2,2");
		points.add("4.0,4.0");
		points.add("5,5");
		List<String> list = GISUtils.splitLineByPoints("1,1,2,2,3,3,5,5",points);
		for(String str:list){
			System.out.println(str);
		}
		
	}

}
