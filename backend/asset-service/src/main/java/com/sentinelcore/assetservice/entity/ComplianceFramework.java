package com.sentinelcore.assetservice.entity;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
@Entity @Table(name="compliance_frameworks") public class ComplianceFramework {
 @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id; @Column(nullable=false) private String name; private String version; private String description; private boolean active=true;
 public UUID getId(){return id;} public void setId(UUID id){this.id=id;} public String getName(){return name;} public void setName(String name){this.name=name;} public String getVersion(){return version;} public void setVersion(String version){this.version=version;} public String getDescription(){return description;} public void setDescription(String description){this.description=description;} public boolean isActive(){return active;} public void setActive(boolean active){this.active=active;}
}