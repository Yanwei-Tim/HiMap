package com.hisense.hiatmp.himap.roadnet.astar.datastructures;

import com.hisense.hiatmp.himap.roadnet.astar.ISearchNode;

public interface IClosedSet {

	public boolean contains(ISearchNode node);
	public void add(ISearchNode node);
	public ISearchNode min();

}
