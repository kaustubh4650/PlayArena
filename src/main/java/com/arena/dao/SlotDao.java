package com.arena.dao;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.arena.entities.Slot;
import com.arena.entities.Turf;

public interface SlotDao extends JpaRepository<Slot, Long> {

	List<Slot> findByTurf(Turf turf);

//	    List<Slot> findByTurfAndDate(Turf turf, LocalDate date);

//	boolean existsByTurfAndDateAndStartTimeAndEndTime(Turf turf, LocalDate date, LocalTime startTime,
//			LocalTime endTime);

	//TO CHECK EXISITING SLOTS
	@Query("SELECT COUNT(s) > 0 FROM Slot s WHERE s.turf = :turf AND s.date = :date "
			+ "AND s.startTime < :endTime AND s.endTime > :startTime")
	boolean existsOverlappingSlot(@Param("turf") Turf turf, @Param("date") LocalDate date,
			@Param("startTime") LocalTime startTime, @Param("endTime") LocalTime endTime);

	
	//TO CHECK EXISITING SLOTS EXCEPTS CURRENT
	@Query("SELECT COUNT(s) > 0 FROM Slot s WHERE s.turf = :turf AND s.date = :date "
			+ "AND s.startTime < :endTime AND s.endTime > :startTime AND s.slotId <> :slotId")
	boolean existsOverlappingSlotExceptSelf(@Param("turf") Turf turf, @Param("date") LocalDate date,
			@Param("startTime") LocalTime startTime, @Param("endTime") LocalTime endTime, @Param("slotId") Long slotId);

//	    List<Slot> findByDate(LocalDate date);
}
