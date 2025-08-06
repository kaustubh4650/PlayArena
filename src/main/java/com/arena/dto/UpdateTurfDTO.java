package com.arena.dto;

import com.arena.entities.Category;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTurfDTO {

    @NotBlank(message = "Turf name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;
    
    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Price per hour is required")
    @Min(value = 100, message = "Price must be at least ₹100")
    private Double pricePerHour;

    @NotBlank(message = "Description is required")
    private String description;
}
