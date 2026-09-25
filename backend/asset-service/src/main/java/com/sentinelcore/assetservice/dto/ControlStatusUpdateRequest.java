package com.sentinelcore.assetservice.dto;
import com.sentinelcore.assetservice.entity.ComplianceStatus;
public class ControlStatusUpdateRequest {
    private ComplianceStatus status; private String owner;
    public ComplianceStatus getStatus(){return status;} public void setStatus(ComplianceStatus v){status=v;}
    public String getOwner(){return owner;} public void setOwner(String v){owner=v;}
}
