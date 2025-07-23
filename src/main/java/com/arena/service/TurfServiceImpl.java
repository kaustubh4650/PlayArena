package com.arena.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.arena.custom_exception.ResourceNotFoundException;
import com.arena.dao.TurfDao;
import com.arena.dto.TurfResDTO;
import com.arena.entities.Turf;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class TurfServiceImpl implements TurfService {

	private TurfDao turfDao;
	private ModelMapper modelMapper;

	@Override
	public List<TurfResDTO> getAllTurfs() {
		List<Turf> turfs = turfDao.findAll();

		if (turfs.isEmpty()) {
			throw new ResourceNotFoundException("No Turf found.");
		}
		return turfs.stream().map(turf -> modelMapper.map(turf, TurfResDTO.class))
				.collect(Collectors.toList());
	}

//-----------------------------------------------------------------------------------------
	
	
	
}
