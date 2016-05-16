package com.hisense.himap.roadnet.astar.datastructures;

import com.hisense.himap.roadnet.astar.ISearchNode;

import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;

public class ClosedSetHash implements IClosedSet {
	private HashMap<Integer, ISearchNode> hashMap;
	private Comparator<ISearchNode> comp;
	
	public ClosedSetHash(Comparator<ISearchNode> comp) {
		this.hashMap = new HashMap<Integer, ISearchNode>();
		this.comp = comp;
		
	}

	public boolean contains(ISearchNode node) {
		return this.hashMap.containsKey(node.keyCode());
	}

	public void add(ISearchNode node) {
		this.hashMap.put(node.keyCode(), node);
	}

	public ISearchNode min() {
		return Collections.min(hashMap.values(), comp);
	}

}
