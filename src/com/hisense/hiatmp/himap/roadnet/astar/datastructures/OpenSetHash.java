package com.hisense.hiatmp.himap.roadnet.astar.datastructures;

import com.hisense.hiatmp.himap.roadnet.astar.ISearchNode;

import java.util.Comparator;

public class OpenSetHash implements IOpenSet {
	private HashPriorityQueue<Integer, ISearchNode> hashQ;
	private Comparator<ISearchNode> comp;

	public OpenSetHash(Comparator<ISearchNode> comp) {
		this.hashQ = new HashPriorityQueue<Integer, ISearchNode>(comp);
		this.comp = comp;
	}

	public void add(ISearchNode node) {
		this.hashQ.add(node.keyCode(), node);
	}

	public void remove(ISearchNode node) {
		this.hashQ.remove(node.keyCode(), node);
	}

	public ISearchNode poll() {
		return this.hashQ.poll();
	}

	public ISearchNode getNode(ISearchNode node) {
		return this.hashQ.get(node.keyCode());
	}

	public int size() {
		return this.hashQ.size();
	}

	@Override
	public String toString() {
		return this.hashQ.getTreeMap().keySet().toString();
	}

}
