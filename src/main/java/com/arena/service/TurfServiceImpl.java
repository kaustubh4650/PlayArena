package com.arena.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.arena.custom_exception.ResourceNotFoundException;
import com.arena.dao.ReviewDao;
import com.arena.dao.SlotDao;
import com.arena.dao.TurfDao;
import com.arena.dto.ReviewResDTO;
import com.arena.dto.SlotResDTO;
import com.arena.dto.TurfResDTO;
import com.arena.entities.Review;
import com.arena.entities.Turf;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class TurfServiceImpl implements TurfService {

	private TurfDao turfDao;
	private SlotDao slotDao;
	private ReviewDao reviewDao;
	private ModelMapper modelMapper;

	@Override
	public List<TurfResDTO> getAllTurfs() {
		List<Turf> turfs = turfDao.findAll();

		if (turfs.isEmpty()) {
			throw new ResourceNotFoundException("No Turf found.");
		}
		
		return turfs.stream().map(turf -> {
	        TurfResDTO dto = modelMapper.map(turf, TurfResDTO.class);
	        dto.setManagerId(turf.getManager().getManagerId());
	        dto.setManagerName(turf.getManager().getName());
	        return dto;
	    }).collect(Collectors.toList());
	}

//-----------------------------------------------------------------------------------------
	
	@Override
	public TurfResDTO getTurfById(Long turfId) {
	    Turf turf = turfDao.findById(turfId)
	            .orElseThrow(() -> new ResourceNotFoundException("Turf not found with ID: " + turfId));

	    TurfResDTO dto = modelMapper.map(turf, TurfResDTO.class);

	    dto.setManagerId(turf.getManager().getManagerId());
	    dto.setManagerName(turf.getManager().getName());

	    return dto;
	}

//-----------------------------------------------------------------------------------------
	
	@Override
	public List<SlotResDTO> getSlotsByTurf(Long turfId) {
		
		Turf turf = turfDao.findById(turfId).orElseThrow(() ->
				new ResourceNotFoundException("Turf not found"));

		return slotDao.findByTurf(turf).stream().map(slot -> {
			SlotResDTO dto = modelMapper.map(slot, SlotResDTO.class);
			dto.setTurfId(turf.getTurfId());
			dto.setTurfName(turf.getName());
			return dto;
		}).collect(Collectors.toList());
	}
	
	
//-----------------------------------------------------------------------------------------

	@Override
	public List<ReviewResDTO> getReviewsByTurf(Long turfId) {
	    Turf turf = turfDao.findById(turfId)
	            .orElseThrow(() -> new ResourceNotFoundException("Turf not found"));

	    List<Review> reviews = reviewDao.findByTurf(turf);

	    return reviews.stream().map(review -> {
	        ReviewResDTO dto = new ReviewResDTO();
	        dto.setReviewId(review.getReviewId());
	        dto.setComment(review.getComment());
	        dto.setRating(review.getRating());
	        dto.setReviewedOn(review.getReviewedOn());

	        dto.setUserId(review.getUser().getUserid());
	        dto.setUserName(review.getUser().getName());

	        dto.setTurfId(turfId);
	        dto.setTurfName(turf.getName());

	        return dto;
	    }).collect(Collectors.toList());
	}

	
//-----------------------------------------------------------------------------------------
	
	
	
}
