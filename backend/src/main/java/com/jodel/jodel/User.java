package com.jodel.jodel;

import jakarta.persistence.*;

@Entity
@Table(name = "client")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
  
    @Column(name = "zahl", nullable = false)
    private Integer zahl;

    // Getter und Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getZahl() {
        return zahl;
    }

    public void setZahl(Integer zahl) {
        this.zahl = zahl;
    }
}
