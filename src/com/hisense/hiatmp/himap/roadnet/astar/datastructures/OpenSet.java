package com.hisense.hiatmp.himap.roadnet.astar.datastructures;

import com.hisense.hiatmp.himap.roadnet.astar.ISearchNode;

import java.util.Comparator;
import java.util.PriorityQueue;

public class OpenSet implements IOpenSet {
	private PriorityQueue<ISearchNode> Q;
	
	public OpenSet(Comparator<ISearchNode> comp) {
		Q = new PriorityQueue<ISearchNode>(1000, comp);
    }

	public void add(ISearchNode node) {
		this.Q.add(node);
	}

	public void remove(ISearchNode node) {
		this.Q.remove(node);

	}

	public ISearchNode poll() {
		return this.Q.poll();
	}

    public ISearchNode getNode(ISearchNode node) {
        for(ISearchNode openSearchNode : this.Q) {
            if(openSearchNode.equals(node)) {
                return openSearchNode;
            }
        }
        return null;
    }

	public int size() {
		return this.Q.size();
	}

}
