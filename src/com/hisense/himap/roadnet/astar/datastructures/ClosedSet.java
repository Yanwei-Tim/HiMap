package com.hisense.himap.roadnet.astar.datastructures;


import com.hisense.himap.roadnet.astar.ISearchNode;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

public class ClosedSet implements IClosedSet {
	private ArrayList<ISearchNode> list;
	private Comparator<ISearchNode> comp;
	
	public ClosedSet(Comparator<ISearchNode> comp) {
		this.list = new ArrayList<ISearchNode>();
		this.comp = comp;
	}

	public boolean contains(ISearchNode node) {
		return this.list.contains(node);
	}

	public void add(ISearchNode node) {
		this.list.add(node);

	}

	public ISearchNode min() {
		return Collections.min(this.list, this.comp);
	}

}
