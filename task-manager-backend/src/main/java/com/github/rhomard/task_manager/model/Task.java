package com.github.rhomard.task_manager.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    private boolean termine = false;

    @Enumerated(EnumType.STRING)
    private TaskCategory category = TaskCategory.AUTRE;

    private LocalDate dateEcheance;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;
}