package com.arena.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.arena.dto.ChangePasswordDTO;
import com.arena.dto.LoginReqDTO;
import com.arena.dto.SlotReqDTO;
import com.arena.dto.TurfReqDTO;
import com.arena.dto.UpdateManagerDTO;
import com.arena.dto.UpdateTurfDTO;
import com.arena.service.ManagerService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/managers")
@AllArgsConstructor
@Validated
public class ManagerController {

	private ManagerService managerService;

	// MANAGER LOGIN
	@PostMapping("/login")
	public ResponseEntity<?> loginManager(@RequestBody LoginReqDTO dto) {
		return ResponseEntity.ok(managerService.loginManager(dto));
	}

	// CHANGE PASSWORD
	@PutMapping("/change-password")
	public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDTO dto) {
		return ResponseEntity.ok(managerService.changePassword(dto));
	}

	// GET MANAGER BY ID
	@GetMapping("/{id}")
	public ResponseEntity<?> getManagerById(@PathVariable Long id) {
		return ResponseEntity.status(HttpStatus.OK).body(managerService.getManagerById(id));
	}

	// UPDATE MANAGER
	@PutMapping("/{id}")
	public ResponseEntity<?> updateManager(@PathVariable Long id, @Valid @RequestBody UpdateManagerDTO dto) {
		return ResponseEntity.status(HttpStatus.OK).body(managerService.updateManagerDetails(id, dto));
	}

	// ADD TURF
	@PostMapping(value = "/turfs/{managerId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> addTurf(@ModelAttribute TurfReqDTO dto, @RequestPart("image") MultipartFile imageFile,
			@PathVariable Long managerId) {

		return ResponseEntity.status(HttpStatus.CREATED).body(managerService.addTurf(dto, imageFile, managerId));
	}

	// DELETE TURF
	@DeleteMapping("/turfs/{id}")
	public ResponseEntity<?> deleteTurfById(@PathVariable Long id) {
		return ResponseEntity.status(HttpStatus.OK).body(managerService.deleteTurfById(id));
	}

	// UPDATE TURF
	@PutMapping(value = "/turfs/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> updateTurf(@PathVariable Long id, @ModelAttribute UpdateTurfDTO dto,
			@RequestPart(value = "image", required = false) MultipartFile imageFile) {
		return ResponseEntity.status(HttpStatus.OK).body(managerService.updateTurfDetails(id, dto, imageFile));
	}

	// GET TURF BY ID
	@GetMapping("/turfs/{id}")
	public ResponseEntity<?> getTurfById(@PathVariable Long id) {
		return ResponseEntity.status(HttpStatus.OK).body(managerService.getTurfById(id));
	}

	// GET ALL TURFS OF SPECIFIC MANAGER
	@GetMapping("/{managerId}/turfs")
	public ResponseEntity<?> getAllTurfsByManager(@PathVariable Long managerId) {
		return ResponseEntity.ok(managerService.getAllTurfsByManager(managerId));
	}

	// ADD SLOT
	@PostMapping("/turfs/{turfId}/slots")
	public ResponseEntity<?> addSlot(@PathVariable Long turfId, @Valid @RequestBody SlotReqDTO dto) {
		return ResponseEntity.status(HttpStatus.CREATED).body(managerService.addSlot(dto, turfId));
	}

	// GET ALL SLOTS
	@GetMapping("/turfs/{turfId}/slots")
	public ResponseEntity<?> getAllSlotsByTurf(@PathVariable Long turfId) {
		return ResponseEntity.ok(managerService.getAllSlotsByTurf(turfId));
	}

	// GET SLOT BY ID
	@GetMapping("/slots/{slotId}")
	public ResponseEntity<?> getSlotById(@PathVariable Long slotId) {
		return ResponseEntity.ok(managerService.getSlotById(slotId));
	}

	// UPDATE SLOT BY ID
	@PutMapping("/slots/{slotId}")
	public ResponseEntity<?> updateSlot(@PathVariable Long slotId, @Valid @RequestBody SlotReqDTO dto) {
		return ResponseEntity.ok(managerService.updateSlot(slotId, dto));
	}

	// DELETE SLOT BY ID
	@DeleteMapping("/slots/{slotId}")
	public ResponseEntity<?> deleteSlotById(@PathVariable Long slotId) {
		return ResponseEntity.status(HttpStatus.OK).body(managerService.deleteSlotById(slotId));

	}
}
