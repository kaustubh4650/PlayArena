package com.arena.service;

import java.util.List;

import com.arena.dto.ReviewResDTO;
import com.arena.dto.SlotResDTO;
import com.arena.dto.TurfResDTO;

public interface TurfService {
	
	List<TurfResDTO> getAllTurfs();
	
	TurfResDTO getTurfById(Long turfId);
	
	List<SlotResDTO> getSlotsByTurf(Long turfId);
	
	List<ReviewResDTO> getReviewsByTurf(Long turfId);
}
