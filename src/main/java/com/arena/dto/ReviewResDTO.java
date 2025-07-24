package com.arena.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReviewResDTO {

    private Long reviewId;
    private String comment;
    private int rating;
    private LocalDateTime reviewedOn;

    private Long userId;
    private String userName;

    private Long turfId;
    private String turfName;
}
