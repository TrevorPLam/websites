<!--
/**
 * @file gdpr-guide.md
 * @role Technical Documentation Guide
 * @summary Documentation and implementation guide for gdpr guide.
 * @entrypoints docs/guides/gdpr-guide.md
 * @exports gdpr guide
 * @depends_on [List dependencies here]
 * @used_by [List consumers here]
 * @runtime Multi-agent / Node.js 20+
 * @data_flow Documentation -> Agentic Context
 * @invariants Standard Markdown format, 2026 technical writing standards
 * @gotchas Missing references in some legacy versions
 * @issues Needs TOC and Reference section standardization
 * @opportunities Automate with multi-agent refinement loop
 * @verification validate-documentation.js
 * @status DRAFT
 */
-->

# gdpr-guide.md

> **Version Reference:** GDPR (General Data Protection Regulation) 2016/679 | Last Updated: 2026-02-23
> **Purpose:** Comprehensive GDPR compliance guide with 2026 best practices, implementation strategies, and advanced privacy patterns

## Table of Contents

1. [Overview](#overview)
2. [Key GDPR Principles](#key-gdpr-principles)
3. [Legal Bases for Processing](#legal-bases-for-processing)
4. [Data Subject Rights](#data-subject-rights)
5. [Data Protection Impact Assessments](#data-protection-impact-assessments)
6. [Data Breach Management](#data-breach-management)
7. [International Data Transfers](#international-data-transfers)
8. [Privacy by Design and Default](#privacy-by-design-and-default)
9. [Technical Implementation](#technical-implementation)
10. [Compliance Monitoring](#compliance-monitoring)
11. [Security Considerations](#security-considerations)
12. [Advanced Privacy Patterns](#advanced-privacy-patterns)
13. [References](#references)

---

## Overview

The General Data Protection Regulation (GDPR) is a comprehensive data protection law that sets requirements for organizations processing personal data of individuals in the European Union. This guide covers key compliance requirements, implementation strategies, and best practices for 2026.

## Key GDPR Principles

### 1. Lawfulness, Fairness, and Transparency

- **Lawful Basis**: Process data only with valid legal basis
- **Fair Processing**: No hidden or deceptive practices
- **Transparency**: Clear information about data processing

### 2. Purpose Limitation

- **Specific Purpose**: Collect data for specified, explicit purposes
- **No Further Processing**: Use data only for declared purposes
- **Compatible Processing**: Limited secondary processing

### 3. Data Minimization

- **Adequate**: Collect only necessary data
- **Relevant**: Data must be relevant to purposes
- **Limited**: Collect minimum required data

### 4. Accuracy

- **Accurate Data**: Maintain accurate and up-to-date information
- **Rectification**: Allow correction of inaccurate data
- **Reasonable Steps**: Take steps to ensure accuracy

### 5. Storage Limitation

- **Retention Periods**: Store data only as long as necessary
- **Review Schedules**: Regular review of data retention
- **Secure Deletion**: Proper data disposal methods

### 6. Integrity and Confidentiality

- **Security Measures**: Implement appropriate technical measures
- **Confidentiality**: Maintain data confidentiality
- **Integrity**: Ensure data integrity and availability

### 7. Accountability

- **Compliance Documentation**: Maintain records of processing activities
- **Responsibility**: Demonstrate compliance with GDPR
- **Governance**: Implement data protection governance

## Legal Bases for Processing

### 1. Consent

```javascript
// Consent management implementation
class ConsentManager {
  constructor() {
    this.consents = new Map();
    this.consentLog = [];
  }

  requestConsent(purposes, userIdentifier) {
    const consentRequest = {
      id: this.generateId(),
      purposes: purposes,
      userIdentifier: userIdentifier,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    this.consentLog.push(consentRequest);
    return consentRequest;
  }

  recordConsent(consentId, decisions, ipAddress, userAgent) {
    const consent = {
      consentId: consentId,
      decisions: decisions,
      ipAddress: ipAddress,
      userAgent: userAgent,
      timestamp: new Date().toISOString(),
      version: '1.0',
    };

    this.consents.set(consentId, consent);
    this.consentLog.push({
      action: 'consent_recorded',
      consentId: consentId,
      timestamp: new Date().toISOString(),
    });

    return consent;
  }

  withdrawConsent(consentId, userIdentifier) {
    const consent = this.consents.get(consentId);
    if (consent) {
      consent.status = 'withdrawn';
      consent.withdrawalTimestamp = new Date().toISOString();

      this.consentLog.push({
        action: 'consent_withdrawn',
        consentId: consentId,
        userIdentifier: userIdentifier,
        timestamp: new Date().toISOString(),
      });
    }
  }

  generateId() {
    return `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### 2. Contractual Necessity

- **Service Provision**: Data necessary for service delivery
- **Contract Terms**: Explicit contractual requirements
- **Pre-contractual Steps**: Data requested before contract formation

### 3. Legal Obligation

- **Regulatory Requirements**: Data required by law
- **Legal Compliance**: Necessary for legal compliance
- **Professional Obligations**: Professional regulatory requirements

### 4. Vital Interests

- **Life Protection**: Data necessary to protect someone's life
- **Medical Emergency**: Emergency medical situations
- **Humanitarian Reasons**: Humanitarian assistance

### 5. Public Task

- **Official Functions**: Data for public interest tasks
- **Legal Authority**: Based on legal authorization
- **Public Interest**: Clear public interest justification

### 6. Legitimate Interests

- **Balancing Test**: Weigh interests against individual rights
- **Commercial Interests**: Legitimate business interests
- **Data Subject Rights**: Consider individual rights and freedoms

## Data Subject Rights

### 1. Right to be Informed

```javascript
// Privacy policy and information disclosure
class InformationDisclosure {
  constructor() {
    this.disclosureTemplates = new Map();
    this.disclosureLog = [];
  }

  createPrivacyPolicy(organization, dataCategories, purposes, retentionPeriods) {
    const policy = {
      organization: organization,
      dataCategories: dataCategories,
      purposes: purposes,
      retentionPeriods: retentionPeriods,
      legalBases: this.identifyLegalBases(purposes),
      thirdPartySharing: this.identifyThirdPartySharing(purposes),
      internationalTransfers: this.identifyInternationalTransfers(),
      rights: this.listDataSubjectRights(),
      contactInformation: this.getContactInformation(organization),
      lastUpdated: new Date().toISOString(),
      version: '1.0',
    };

    return policy;
  }

  provideTransparencyNotice(dataSubject, dataProcessing) {
    const notice = {
      dataSubject: dataSubject,
      processingActivities: dataProcessing,
      legalBasis: dataProcessing.legalBasis,
      purposes: dataProcessing.purposes,
      dataCategories: dataProcessing.dataCategories,
      retentionPeriod: dataProcessing.retentionPeriod,
      rights: this.getApplicableRights(dataProcessing.legalBasis),
      contactInfo: this.getContactInfo(),
      timestamp: new Date().toISOString(),
    };

    this.disclosureLog.push({
      action: 'transparency_notice_provided',
      dataSubject: dataSubject.identifier,
      timestamp: new Date().toISOString(),
    });

    return notice;
  }
}
```

### 2. Right of Access (DSAR)

```javascript
// Data Subject Access Request implementation
class DSARProcessor {
  constructor() {
    this.dsarQueue = [];
    this.processingLog = [];
  }

  submitDSAR(dataSubject, requestDetails) {
    const dsar = {
      id: this.generateDSARId(),
      dataSubject: dataSubject,
      requestType: 'access',
      scope: requestDetails.scope || 'all',
      format: requestDetails.format || 'electronic',
      timestamp: new Date().toISOString(),
      status: 'received',
      deadline: this.calculateDeadline(),
    };

    this.dsarQueue.push(dsar);
    this.processingLog.push({
      action: 'dsar_received',
      dsarId: dsar.id,
      timestamp: new Date().toISOString(),
    });

    return dsar;
  }

  async processDSAR(dsarId) {
    const dsar = this.dsarQueue.find((d) => d.id === dsarId);
    if (!dsar) {
      throw new Error('DSAR not found');
    }

    dsar.status = 'processing';
    dsar.processingStart = new Date().toISOString();

    try {
      // Collect all personal data
      const personalData = await this.collectPersonalData(dsar.dataSubject, dsar.scope);

      // Verify identity
      const identityVerified = await this.verifyIdentity(dsar.dataSubject);
      if (!identityVerified) {
        throw new Error('Identity verification failed');
      }

      // Format data for delivery
      const formattedData = await this.formatData(personalData, dsar.format);

      // Create response package
      const responsePackage = {
        dsarId: dsar.id,
        dataSubject: dsar.dataSubject,
        personalData: formattedData,
        metadata: {
          recordCount: Object.keys(formattedData).length,
          processingDate: new Date().toISOString(),
          sources: this.identifyDataSources(formattedData),
          categories: this.identifyDataCategories(formattedData),
        },
        providedDate: new Date().toISOString(),
      };

      dsar.status = 'completed';
      dsar.completionDate = new Date().toISOString();

      this.processingLog.push({
        action: 'dsar_completed',
        dsarId: dsar.id,
        timestamp: new Date().toISOString(),
      });

      return responsePackage;
    } catch (error) {
      dsar.status = 'error';
      dsar.error = error.message;

      this.processingLog.push({
        action: 'dsar_error',
        dsarId: dsar.id,
        error: error.message,
        timestamp: new Date().toISOString(),
      });

      throw error;
    }
  }

  calculateDeadline() {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30); // 30 days from request
    return deadline.toISOString();
  }

  generateDSARId() {
    return `DSAR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

### 3. Right to Rectification

```javascript
// Data correction implementation
class DataRectification {
  constructor() {
    this.rectificationRequests = [];
    this.auditLog = [];
  }

  requestRectification(dataSubject, corrections) {
    const request = {
      id: this.generateRequestId(),
      dataSubject: dataSubject,
      corrections: corrections,
      timestamp: new Date().toISOString(),
      status: 'pending',
      deadline: this.calculateDeadline(),
    };

    this.rectificationRequests.push(request);
    return request;
  }

  async processRectification(requestId) {
    const request = this.rectificationRequests.find((r) => r.id === requestId);
    if (!request) {
      throw new Error('Rectification request not found');
    }

    request.status = 'processing';

    try {
      for (const correction of request.corrections) {
        await this.applyCorrection(correction);
        this.auditLog.push({
          action: 'data_corrected',
          dataSubject: request.dataSubject.identifier,
          field: correction.field,
          oldValue: correction.oldValue,
          newValue: correction.newValue,
          timestamp: new Date().toISOString(),
        });
      }

      request.status = 'completed';
      request.completionDate = new Date().toISOString();

      // Notify data subject
      await this.notifyDataSubject(request.dataSubject, request);
    } catch (error) {
      request.status = 'error';
      request.error = error.message;
      throw error;
    }
  }

  async applyCorrection(correction) {
    // Implementation depends on data storage system
    // This is a placeholder for actual data correction logic
    console.log(
      `Applying correction: ${correction.field} from ${correction.oldValue} to ${correction.newValue}`
    );
  }
}
```

### 4. Right to Erasure (Right to be Forgotten)

```javascript
// Data deletion implementation
class RightToErasure {
  constructor() {
    this.erasureRequests = [];
    this.deletionLog = [];
  }

  requestErasure(dataSubject, scope) {
    const request = {
      id: this.generateRequestId(),
      dataSubject: dataSubject,
      scope: scope || 'all',
      timestamp: new Date().toISOString(),
      status: 'pending',
      legalBasisReview: this.legalBasisReviewRequired(scope),
    };

    this.erasureRequests.push(request);
    return request;
  }

  async processErasure(requestId) {
    const request = this.erasureRequests.find((r) => r.id === requestId);
    if (!request) {
      throw new Error('Erasure request not found');
    }

    // Legal basis review
    if (request.legalBasisReview) {
      const canErase = await this.legalBasisReview(request);
      if (!canErase) {
        request.status = 'denied';
        request.reason = 'Legal basis for retention exists';
        return request;
      }
    }

    request.status = 'processing';

    try {
      // Identify all personal data
      const dataLocations = await this.identifyDataLocations(request.dataSubject, request.scope);

      // Erase data from all locations
      for (const location of dataLocations) {
        await this.eraseDataFromLocation(location, request.dataSubject);

        this.deletionLog.push({
          action: 'data_erased',
          dataSubject: request.dataSubject.identifier,
          location: location.type,
          recordCount: location.recordCount,
          timestamp: new Date().toISOString(),
        });
      }

      // Notify third parties
      await this.notifyThirdParties(request);

      request.status = 'completed';
      request.completionDate = new Date().toISOString();
    } catch (error) {
      request.status = 'error';
      request.error = error.message;
      throw error;
    }
  }

  async legalBasisReview(request) {
    // Check if there are legal grounds for retaining data
    const legalGrounds = await this.checkLegalGrounds(request.dataSubject, request.scope);
    return !legalGrounds.length;
  }
}
```

### 5. Right to Restrict Processing

```javascript
// Processing restriction implementation
class ProcessingRestriction {
  constructor() {
    this.restrictionRequests = [];
    this.restrictionLog = [];
  }

  requestRestriction(dataSubject, grounds, scope) {
    const request = {
      id: this.generateRequestId(),
      dataSubject: dataSubject,
      grounds: grounds, // 'accuracy_disputed', 'unlawful', 'no_longer_needed', 'legal_claim'
      scope: scope || 'all',
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    this.restrictionRequests.push(request);
    return request;
  }

  async applyRestriction(requestId) {
    const request = this.restrictionRequests.find((r) => r.id === requestId);
    if (!request) {
      throw new Error('Restriction request not found');
    }

    request.status = 'processing';

    try {
      // Identify processing activities
      const processingActivities = await this.identifyProcessingActivities(
        request.dataSubject,
        request.scope
      );

      // Apply restrictions
      for (const activity of processingActivities) {
        await this.restrictProcessing(activity, request);

        this.restrictionLog.push({
          action: 'processing_restricted',
          dataSubject: request.dataSubject.identifier,
          activity: activity.type,
          grounds: request.grounds,
          timestamp: new Date().toISOString(),
        });
      }

      request.status = 'completed';
      request.completionDate = new Date().toISOString();
    } catch (error) {
      request.status = 'error';
      request.error = error.message;
      throw error;
    }
  }
}
```

## Data Protection Impact Assessment (DPIA)

### DPIA Framework

```javascript
// DPIA implementation
class DPIAProcessor {
  constructor() {
    this.dpias = [];
    this.reviewLog = [];
  }

  initiateDPIA(processingActivity) {
    const dpia = {
      id: this.generateDPIAId(),
      processingActivity: processingActivity,
      status: 'initiated',
      timestamp: new Date().toISOString(),
      assessors: [],
      risks: [],
      mitigationMeasures: [],
      recommendations: [],
    };

    this.dpias.push(dpia);
    return dpia;
  }

  assessRisks(dpiaId) {
    const dpia = this.dpias.find((d) => d.id === dpiaId);
    if (!dpia) {
      throw new Error('DPIA not found');
    }

    // Identify risks
    const risks = this.identifyRisks(dpia.processingActivity);
    dpia.risks = risks;

    // Assess risk levels
    const assessedRisks = risks.map((risk) => ({
      ...risk,
      likelihood: this.assessLikelihood(risk),
      impact: this.assessImpact(risk),
      riskLevel: this.calculateRiskLevel(risk),
    }));

    dpia.risks = assessedRisks;
    dpia.status = 'risk_assessed';

    return assessedRisks;
  }

  identifyRisks(processingActivity) {
    const risks = [];

    // Data type risks
    if (processingActivity.dataCategories.includes('special_category')) {
      risks.push({
        type: 'special_category_data',
        description: 'Processing special category data',
        potentialHarm: 'Discrimination or privacy violation',
      });
    }

    // Scale risks
    if (processingActivity.dataVolume === 'large_scale') {
      risks.push({
        type: 'large_scale_processing',
        description: 'Large-scale data processing',
        potentialHarm: 'Mass privacy breach',
      });
    }

    // Technology risks
    if (processingActivity.technology.includes('ai_ml')) {
      risks.push({
        type: 'automated_decision_making',
        description: 'Automated decision making',
        potentialHarm: 'Discrimination or unfair treatment',
      });
    }

    // International transfer risks
    if (processingActivity.internationalTransfers) {
      risks.push({
        type: 'international_transfer',
        description: 'Data transfers outside EEA',
        potentialHarm: 'Reduced protection standards',
      });
    }

    return risks;
  }

  calculateRiskLevel(risk) {
    const likelihoodScore = this.getLikelihoodScore(risk.likelihood);
    const impactScore = this.getImpactScore(risk.impact);
    const totalScore = likelihoodScore * impactScore;

    if (totalScore >= 15) return 'high';
    if (totalScore >= 8) return 'medium';
    return 'low';
  }

  generateDPIAReport(dpiaId) {
    const dpia = this.dpias.find((d) => d.id === dpiaId);
    if (!dpia) {
      throw new Error('DPIA not found');
    }

    const report = {
      summary: {
        dpiaId: dpia.id,
        processingActivity: dpia.processingActivity.name,
        assessmentDate: new Date().toISOString(),
        assessors: dpia.assessors,
        overallRiskLevel: this.calculateOverallRiskLevel(dpia.risks),
      },
      risks: dpia.risks,
      mitigationMeasures: dpia.mitigationMeasures,
      recommendations: this.generateRecommendations(dpia.risks),
      conclusion: this.generateConclusion(dpia),
      approval: {
        status: dpia.status,
        approvedBy: dpia.approvedBy,
        approvalDate: dpia.approvalDate,
      },
    };

    return report;
  }
}
```

## Data Breach Management

### Breach Notification Framework

```javascript
// Data breach management
class DataBreachManager {
  constructor() {
    this.breaches = [];
    this.notificationLog = [];
  }

  reportBreach(breachDetails) {
    const breach = {
      id: this.generateBreachId(),
      details: breachDetails,
      timestamp: new Date().toISOString(),
      status: 'reported',
      severity: this.assessSeverity(breachDetails),
      notificationRequired: this.isNotificationRequired(breachDetails),
      deadline: this.calculateNotificationDeadline(breachDetails),
    };

    this.breaches.push(breach);

    // Start investigation
    this.initiateInvestigation(breach.id);

    return breach;
  }

  assessSeverity(breachDetails) {
    let score = 0;

    // Data sensitivity
    if (breachDetails.dataTypes.includes('special_category')) score += 3;
    if (breachDetails.dataTypes.includes('financial')) score += 2;
    if (breachDetails.dataTypes.includes('health')) score += 3;

    // Volume of data
    if (breachDetails.affectedRecords > 10000) score += 2;
    if (breachDetails.affectedRecords > 100000) score += 3;

    // Likelihood of harm
    if (breachDetails.dataAccessed === 'clear_text') score += 2;
    if (breachDetails.maliciousIntent) score += 2;

    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  }

  isNotificationRequired(breachDetails) {
    // High severity always requires notification
    if (this.assessSeverity(breachDetails) === 'high') {
      return true;
    }

    // Medium severity requires assessment
    if (this.assessSeverity(breachDetails) === 'medium') {
      return this.assessRiskToRights(breachDetails);
    }

    // Low severity may not require notification
    return false;
  }

  async notifySupervisoryAuthority(breachId) {
    const breach = this.breaches.find((b) => b.id === breachId);
    if (!breach) {
      throw new Error('Breach not found');
    }

    const notification = {
      breachId: breach.id,
      organizationDetails: this.getOrganizationDetails(),
      breachDescription: this.formatBreachDescription(breach),
      likelyConsequences: this.assessConsequences(breach),
      mitigationMeasures: this.getMitigationMeasures(breach),
      contactInformation: this.getDPOContact(),
      timestamp: new Date().toISOString(),
    };

    // Send notification to supervisory authority
    await this.sendNotification(notification);

    breach.status = 'notified_authority';
    breach.authorityNotificationDate = new Date().toISOString();

    this.notificationLog.push({
      action: 'authority_notified',
      breachId: breach.id,
      timestamp: new Date().toISOString(),
    });
  }

  async notifyDataSubjects(breachId) {
    const breach = this.breaches.find((b) => b.id === breachId);
    if (!breach) {
      throw new Error('Breach not found');
    }

    const affectedSubjects = await this.identifyAffectedSubjects(breach);

    for (const subject of affectedSubjects) {
      const notification = {
        breachId: breach.id,
        dataSubject: subject,
        breachDescription: this.formatSubjectNotification(breach),
        recommendedActions: this.getRecommendedActions(breach),
        contactInformation: this.getDPOContact(),
        timestamp: new Date().toISOString(),
      };

      await this.sendSubjectNotification(notification);
    }

    breach.status = 'notified_subjects';
    breach.subjectNotificationDate = new Date().toISOString();

    this.notificationLog.push({
      action: 'subjects_notified',
      breachId: breach.id,
      subjectCount: affectedSubjects.length,
      timestamp: new Date().toISOString(),
    });
  }
}
```

## International Data Transfers

### Transfer Mechanisms

```javascript
// International data transfer management
class InternationalTransferManager {
  constructor() {
    this.transfers = [];
    this.transferMechanisms = new Map();
    this.adequacyDecisions = new Map();
  }

  initiateTransfer(dataCategories, destinationCountry, legalBasis) {
    const transfer = {
      id: this.generateTransferId(),
      dataCategories: dataCategories,
      destinationCountry: destinationCountry,
      legalBasis: legalBasis,
      mechanism: this.selectTransferMechanism(destinationCountry, legalBasis),
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    this.transfers.push(transfer);
    return transfer;
  }

  selectTransferMechanism(country, legalBasis) {
    // Check adequacy decision
    if (this.hasAdequacyDecision(country)) {
      return {
        type: 'adequacy_decision',
        country: country,
        decisionDate: this.adequacyDecisions.get(country).date,
        status: 'valid',
      };
    }

    // Check for appropriate safeguards
    if (legalBasis === 'appropriate_safeguards') {
      return {
        type: 'appropriate_safeguards',
        mechanism: 'standard_contractual_clauses',
        version: '2021',
        modules: this.selectSCCModules(dataCategories),
      };
    }

    // Check for binding corporate rules
    if (legalBasis === 'binding_corporate_rules') {
      return {
        type: 'binding_corporate_rules',
        approvalDate: this.getBCRApprovalDate(),
        scope: this.getBCRScope(),
      };
    }

    // Check for derogations
    if (legalBasis === 'derogations') {
      return {
        type: 'derogations',
        specificSituation: this.identifyDerogation(dataCategories, country),
        timeLimit: this.calculateTimeLimit(),
      };
    }

    throw new Error('No valid transfer mechanism available');
  }

  hasAdequacyDecision(country) {
    return (
      this.adequacyDecisions.has(country) && this.adequacyDecisions.get(country).status === 'valid'
    );
  }

  selectSCCModules(dataCategories) {
    // Module selection based on data flow and controller/processor relationships
    const modules = [];

    if (dataCategories.includes('personal_data')) {
      modules.push('module_one'); // Controller to controller
    }

    if (dataCategories.includes('special_category')) {
      modules.push('module_two'); // Special category data
    }

    if (dataCategories.includes('processor_data')) {
      modules.push('module_three'); // Controller to processor
    }

    return modules;
  }

  performTransferImpactAssessment(transferId) {
    const transfer = this.transfers.find((t) => t.id === transferId);
    if (!transfer) {
      throw new Error('Transfer not found');
    }

    const assessment = {
      transferId: transfer.id,
      destinationCountry: transfer.destinationCountry,
      legalFramework: this.assessLegalFramework(transfer.destinationCountry),
      accessPossibilities: this.assessGovernmentAccess(transfer.destinationCountry),
      supplementaryMeasures: this.identifySupplementaryMeasures(transfer),
      overallRisk: this.assessOverallRisk(transfer),
      recommendations: this.generateTransferRecommendations(transfer),
      timestamp: new Date().toISOString(),
    };

    transfer.impactAssessment = assessment;
    transfer.status = 'assessed';

    return assessment;
  }
}
```

## Records of Processing Activities (ROPA)

### ROPA Management

```javascript
// ROPA implementation
class ROPAManager {
  constructor() {
    this.processingActivities = [];
    this.ropaVersion = '1.0';
    this.lastUpdated = new Date().toISOString();
  }

  addProcessingActivity(activity) {
    const processingActivity = {
      id: this.generateActivityId(),
      controller: activity.controller,
      purposes: activity.purposes,
      legalBasis: activity.legalBasis,
      dataCategories: activity.dataCategories,
      recipients: activity.recipients,
      retentionPeriod: activity.retentionPeriod,
      internationalTransfers: activity.internationalTransfers || [],
      securityMeasures: activity.securityMeasures,
      dataSubjectCategories: activity.dataSubjectCategories,
      timestamp: new Date().toISOString(),
      status: 'active',
    };

    this.processingActivities.push(processingActivity);
    this.updateROPAVersion();

    return processingActivity;
  }

  generateROPAReport() {
    const report = {
      metadata: {
        version: this.ropaVersion,
        lastUpdated: this.lastUpdated,
        controller: this.getControllerDetails(),
        dpo: this.getDPODetails(),
        reviewDate: this.calculateNextReviewDate(),
      },
      processingActivities: this.processingActivities.map((activity) => ({
        name: activity.name,
        description: activity.description,
        purposes: activity.purposes,
        legalBasis: activity.legalBasis,
        dataCategories: activity.dataCategories,
        dataSubjects: activity.dataSubjectCategories,
        recipients: activity.recipients,
        retentionPeriod: activity.retentionPeriod,
        internationalTransfers: activity.internationalTransfers,
        securityMeasures: activity.securityMeasures,
        lastReview: activity.lastReview,
        nextReview: activity.nextReview,
      })),
      summary: this.generateROPASummary(),
    };

    return report;
  }

  generateROPASummary() {
    const summary = {
      totalActivities: this.processingActivities.length,
      dataCategories: this.summarizeDataCategories(),
      legalBases: this.summarizeLegalBases(),
      internationalTransfers: this.summarizeInternationalTransfers(),
      highRiskActivities: this.identifyHighRiskActivities(),
      upcomingReviews: this.identifyUpcomingReviews(),
    };

    return summary;
  }

  identifyHighRiskActivities() {
    return this.processingActivities.filter((activity) => {
      return (
        activity.dataCategories.includes('special_category') ||
        activity.internationalTransfers.length > 0 ||
        activity.purposes.includes('automated_decision_making')
      );
    });
  }
}
```

## Privacy by Design and Default

### Implementation Framework

```javascript
// Privacy by Design implementation
class PrivacyByDesign {
  constructor() {
    this.designPrinciples = [];
    this.implementationGuides = new Map();
  }

  applyPrivacyByDesign(systemDesign) {
    const privacyAssessment = {
      systemId: systemDesign.id,
      dataMinimization: this.assessDataMinimization(systemDesign),
      purposeLimitation: this.assessPurposeLimitation(systemDesign),
      securityMeasures: this.assessSecurityMeasures(systemDesign),
      userControl: this.assessUserControl(systemDesign),
      transparency: this.assessTransparency(systemDesign),
      recommendations: this.generatePrivacyRecommendations(systemDesign),
    };

    return privacyAssessment;
  }

  assessDataMinimization(systemDesign) {
    const assessment = {
      score: 0,
      findings: [],
      recommendations: [],
    };

    // Check data collection practices
    if (systemDesign.dataCollection === 'collect_all') {
      assessment.findings.push({
        type: 'excessive_collection',
        severity: 'high',
        description: 'System collects all available data',
      });
      assessment.recommendations.push({
        action: 'implement_selective_collection',
        priority: 'high',
      });
    } else {
      assessment.score += 2;
    }

    // Check data retention
    if (systemDesign.retentionPolicy === 'indefinite') {
      assessment.findings.push({
        type: 'indefinite_retention',
        severity: 'medium',
        description: 'Data retained indefinitely',
      });
      assessment.recommendations.push({
        action: 'implement_retention_limits',
        priority: 'medium',
      });
    } else {
      assessment.score += 2;
    }

    return assessment;
  }

  generatePrivacyRecommendations(systemDesign) {
    const recommendations = [];

    // Data minimization recommendations
    if (systemDesign.dataCollection === 'collect_all') {
      recommendations.push({
        category: 'data_minimization',
        recommendation: 'Implement data minimization by design',
        implementation: 'Modify data collection to only collect necessary data',
        priority: 'high',
        estimatedEffort: 'medium',
      });
    }

    // Security recommendations
    if (!systemDesign.encryption) {
      recommendations.push({
        category: 'security',
        recommendation: 'Implement end-to-end encryption',
        implementation: 'Add encryption for data at rest and in transit',
        priority: 'high',
        estimatedEffort: 'medium',
      });
    }

    // User control recommendations
    if (!systemDesign.userDashboard) {
      recommendations.push({
        category: 'user_control',
        recommendation: 'Implement user privacy dashboard',
        implementation: 'Create interface for users to manage their data',
        priority: 'medium',
        estimatedEffort: 'high',
      });
    }

    return recommendations;
  }
}
```

## Compliance Monitoring and Auditing

### Compliance Framework

```javascript
// Compliance monitoring system
class ComplianceMonitor {
  constructor() {
    this.complianceChecks = [];
    this.auditLog = [];
    this.metrics = new Map();
  }

  performComplianceCheck(checkType, scope) {
    const check = {
      id: this.generateCheckId(),
      type: checkType,
      scope: scope,
      timestamp: new Date().toISOString(),
      status: 'in_progress',
      findings: [],
      score: 0,
      recommendations: [],
    };

    this.complianceChecks.push(check);

    // Perform specific compliance check
    switch (checkType) {
      case 'data_protection':
        return this.performDataProtectionCheck(check);
      case 'consent_management':
        return this.performConsentCheck(check);
      case 'security_measures':
        return this.performSecurityCheck(check);
      case 'international_transfers':
        return this.performTransferCheck(check);
      default:
        throw new Error('Unknown check type');
    }
  }

  performDataProtectionCheck(check) {
    const findings = [];

    // Check lawful basis documentation
    const lawfulBasisCheck = this.checkLawfulBasisDocumentation(check.scope);
    findings.push(lawfulBasisCheck);

    // Check data retention policies
    const retentionCheck = this.checkRetentionPolicies(check.scope);
    findings.push(retentionCheck);

    // Check data subject rights procedures
    const rightsCheck = this.checkDataSubjectRights(check.scope);
    findings.push(rightsCheck);

    // Check DPIA requirements
    const dpiaCheck = this.checkDPIARequirements(check.scope);
    findings.push(dpiaCheck);

    check.findings = findings;
    check.score = this.calculateComplianceScore(findings);
    check.status = 'completed';

    return check;
  }

  calculateComplianceScore(findings) {
    const totalChecks = findings.length;
    const passedChecks = findings.filter((f) => f.status === 'pass').length;
    return Math.round((passedChecks / totalChecks) * 100);
  }

  generateComplianceReport(timeframe) {
    const checks = this.complianceChecks.filter(
      (check) =>
        new Date(check.timestamp) >= new Date(timeframe.start) &&
        new Date(check.timestamp) <= new Date(timeframe.end)
    );

    const report = {
      period: timeframe,
      overallScore: this.calculateOverallScore(checks),
      checkResults: checks,
      trends: this.analyzeTrends(checks),
      highRiskAreas: this.identifyHighRiskAreas(checks),
      recommendations: this.generateComplianceRecommendations(checks),
      nextSteps: this.planNextSteps(checks),
    };

    return report;
  }
}
```

---

## Security Considerations

### 1. Technical Security Measures

#### Data Encryption

```typescript
// Comprehensive encryption strategy for GDPR compliance
class GDPRCompliantEncryption {
  private readonly encryptionKey: string;
  private readonly algorithm = 'AES-256-GCM';

  constructor(key: string) {
    this.encryptionKey = key;
  }

  // Encrypt personal data at rest
  async encryptPersonalData(data: PersonalData): Promise<EncryptedData> {
    const key = await crypto.subtle.importKey(
      'raw',
      Buffer.from(this.encryptionKey, 'base64'),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(JSON.stringify(data));

    const encrypted = await crypto.subtle.encrypt({ name: this.algorithm, iv }, key, encodedData);

    return {
      data: Buffer.from(encrypted).toString('base64'),
      iv: Buffer.from(iv).toString('base64'),
      algorithm: this.algorithm,
      timestamp: new Date().toISOString(),
    };
  }

  // Decrypt personal data with audit logging
  async decryptPersonalData(encryptedData: EncryptedData): Promise<PersonalData> {
    // Log decryption attempt for audit trail
    await this.auditLog('DATA_DECRYPTION_ATTEMPT', {
      timestamp: new Date().toISOString(),
      dataType: 'personal_data',
      encrypted: true,
    });

    const key = await crypto.subtle.importKey(
      'raw',
      Buffer.from(this.encryptionKey, 'base64'),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const iv = Buffer.from(encryptedData.iv, 'base64');
    const encrypted = Buffer.from(encryptedData.data, 'base64');

    const decrypted = await crypto.subtle.decrypt({ name: this.algorithm, iv }, key, encrypted);

    const decryptedData = new TextDecoder().decode(decrypted);

    // Log successful decryption
    await this.auditLog('DATA_DECRYPTION_SUCCESS', {
      timestamp: new Date().toISOString(),
      dataType: 'personal_data',
    });

    return JSON.parse(decryptedData);
  }

  private async auditLog(action: string, details: any): Promise<void> {
    // Implement audit logging for compliance
    console.log(`GDPR Audit: ${action}`, details);
  }
}
```

#### Access Control

```typescript
// Role-based access control for personal data
class GDPRAccessControl {
  private readonly userRoles: Map<string, UserRole> = new Map();
  private readonly dataCategories: Map<string, DataCategory> = new Map();

  constructor() {
    this.initializeRoles();
    this.initializeDataCategories();
  }

  // Check if user has permission to access specific data category
  async checkAccessPermission(
    userId: string,
    dataCategory: string,
    operation: 'read' | 'write' | 'delete'
  ): Promise<AccessResult> {
    const userRole = this.userRoles.get(userId);
    const category = this.dataCategories.get(dataCategory);

    if (!userRole || !category) {
      return { allowed: false, reason: 'Invalid user or data category' };
    }

    // Check role-based permissions
    const hasPermission = this.checkRolePermission(userRole, category, operation);

    if (!hasPermission) {
      await this.logAccessDenied(userId, dataCategory, operation);
      return { allowed: false, reason: 'Insufficient permissions' };
    }

    // Log access for audit trail
    await this.logAccessGranted(userId, dataCategory, operation);

    return { allowed: true, reason: 'Permission granted' };
  }

  private checkRolePermission(role: UserRole, category: DataCategory, operation: string): boolean {
    const permissions = role.permissions[category.sensitivity];
    return permissions && permissions.includes(operation);
  }

  private async logAccessDenied(
    userId: string,
    dataCategory: string,
    operation: string
  ): Promise<void> {
    await this.auditLog('ACCESS_DENIED', {
      userId,
      dataCategory,
      operation,
      timestamp: new Date().toISOString(),
      severity: 'HIGH',
    });
  }

  private async logAccessGranted(
    userId: string,
    dataCategory: string,
    operation: string
  ): Promise<void> {
    await this.auditLog('ACCESS_GRANTED', {
      userId,
      dataCategory,
      operation,
      timestamp: new Date().toISOString(),
      severity: 'LOW',
    });
  }
}
```

### 2. Data Breach Security

#### Breach Detection and Response

```typescript
// Automated breach detection system
class GDPRBreachDetector {
  private readonly alertThresholds = {
    unusualAccessPattern: 10, // 10 unusual accesses in 1 hour
    dataExportVolume: 1000, // 1000 records exported
    failedAuthAttempts: 5, // 5 failed authentication attempts
    dataAccessOutsideHours: true, // Access outside business hours
  };

  async monitorDataAccess(accessEvent: DataAccessEvent): Promise<BreachAlert[]> {
    const alerts: BreachAlert[] = [];

    // Check for unusual access patterns
    const unusualPattern = await this.detectUnusualAccessPattern(accessEvent);
    if (unusualPattern) {
      alerts.push(unusualPattern);
    }

    // Check for large data exports
    const largeExport = await this.detectLargeDataExport(accessEvent);
    if (largeExport) {
      alerts.push(largeExport);
    }

    // Check for failed authentication attempts
    const failedAuth = await this.detectFailedAuthAttempts(accessEvent);
    if (failedAuth) {
      alerts.push(failedAuth);
    }

    // Check for access outside business hours
    const afterHoursAccess = await this.detectAfterHoursAccess(accessEvent);
    if (afterHoursAccess) {
      alerts.push(afterHoursAccess);
    }

    return alerts;
  }

  private async detectUnusualAccessPattern(event: DataAccessEvent): Promise<BreachAlert | null> {
    const recentAccess = await this.getRecentAccessEvents(event.userId, 3600); // 1 hour

    if (recentAccess.length > this.alertThresholds.unusualAccessPattern) {
      return {
        type: 'UNUSUAL_ACCESS_PATTERN',
        severity: 'MEDIUM',
        description: `User ${event.userId} accessed data ${recentAccess.length} times in the last hour`,
        timestamp: new Date().toISOString(),
        requiresInvestigation: true,
      };
    }

    return null;
  }

  private async detectLargeDataExport(event: DataAccessEvent): Promise<BreachAlert | null> {
    if (event.operation === 'export' && event.recordCount > this.alertThresholds.dataExportVolume) {
      return {
        type: 'LARGE_DATA_EXPORT',
        severity: 'HIGH',
        description: `Large data export of ${event.recordCount} records by user ${event.userId}`,
        timestamp: new Date().toISOString(),
        requiresInvestigation: true,
        requiresBreachNotification: true,
      };
    }

    return null;
  }
}
```

---

## Advanced Privacy Patterns

### 1. Privacy-Enhancing Technologies (PETs)

#### Differential Privacy

```typescript
// Differential privacy implementation for statistical analysis
class DifferentialPrivacy {
  private readonly epsilon: number; // Privacy budget
  private readonly sensitivity: number;

  constructor(epsilon: number = 1.0, sensitivity: number = 1.0) {
    this.epsilon = epsilon;
    this.sensitivity = sensitivity;
  }

  // Add Laplace noise for differential privacy
  addLaplaceNoise(value: number): number {
    const scale = this.sensitivity / this.epsilon;
    const noise = this.generateLaplaceNoise(scale);
    return value + noise;
  }

  // Private histogram with differential privacy
  createPrivateHistogram(data: number[], bins: number): PrivateHistogram {
    const histogram = new Array(bins).fill(0);
    const binSize = Math.ceil(data.length / bins);

    // Count data points in each bin
    for (let i = 0; i < data.length; i++) {
      const binIndex = Math.floor(i / binSize);
      histogram[binIndex]++;
    }

    // Add noise to each bin
    const privateHistogram = histogram.map((count) => Math.max(0, this.addLaplaceNoise(count)));

    return {
      bins: privateHistogram,
      epsilon: this.epsilon,
      sensitivity: this.sensitivity,
      timestamp: new Date().toISOString(),
    };
  }

  private generateLaplaceNoise(scale: number): number {
    const u = Math.random() - 0.5;
    return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  }
}
```

#### Homomorphic Encryption

```typescript
// Basic homomorphic encryption for secure computation
class HomomorphicEncryption {
  private readonly publicKey: CryptoKey;
  private readonly privateKey: CryptoKey;

  async generateKeyPair(): Promise<void> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: { name: 'SHA-256' },
      },
      true,
      ['encrypt', 'decrypt']
    );

    this.publicKey = keyPair.publicKey;
    this.privateKey = keyPair.privateKey;
  }

  // Encrypt data for homomorphic operations
  async encryptForComputation(data: number): Promise<EncryptedNumber> {
    const encoded = new TextEncoder().encode(data.toString());
    const encrypted = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, this.publicKey, encoded);

    return {
      value: Buffer.from(encrypted).toString('base64'),
      operation: 'encrypted',
    };
  }

  // Secure aggregation without decrypting individual values
  async secureSum(encryptedValues: EncryptedNumber[]): Promise<EncryptedNumber> {
    // Simplified homomorphic addition (real implementation requires proper HE scheme)
    const sum = await this.performHomomorphicAddition(encryptedValues);

    return {
      value: sum,
      operation: 'homomorphic_sum',
      inputCount: encryptedValues.length,
    };
  }

  private async performHomomorphicAddition(values: EncryptedNumber[]): Promise<string> {
    // This is a simplified representation
    // Real homomorphic encryption requires specialized libraries
    return values.map((v) => v.value).join('+');
  }
}
```

### 2. Federated Learning for Privacy

#### Privacy-Preserving Machine Learning

```typescript
// Federated learning implementation for privacy-preserving ML
class FederatedLearningPrivacy {
  private readonly participants: Map<string, Participant> = new Map();
  private readonly globalModel: MLModel;

  constructor() {
    this.globalModel = new MLModel();
  }

  // Train model locally without sharing raw data
  async trainLocally(participantId: string, localData: PersonalData[]): Promise<LocalModelUpdate> {
    const participant = this.participants.get(participantId);

    if (!participant) {
      throw new Error('Participant not found');
    }

    // Apply differential privacy to local training
    const privateUpdate = await this.trainWithDifferentialPrivacy(
      localData,
      participant.privacyBudget
    );

    // Only share model updates, not raw data
    return {
      participantId,
      modelWeights: privateUpdate.weights,
      updateSize: privateUpdate.size,
      privacyBudgetUsed: privateUpdate.epsilonUsed,
      timestamp: new Date().toISOString(),
    };
  }

  // Aggregate model updates securely
  async aggregateUpdates(updates: LocalModelUpdate[]): Promise<GlobalModelUpdate> {
    // Apply secure aggregation with privacy guarantees
    const aggregatedWeights = await this.secureAggregation(updates.map((u) => u.modelWeights));

    // Update global model
    this.globalModel.updateWeights(aggregatedWeights);

    return {
      globalWeights: aggregatedWeights,
      participantCount: updates.length,
      totalPrivacyBudget: updates.reduce((sum, u) => sum + u.privacyBudgetUsed, 0),
      timestamp: new Date().toISOString(),
    };
  }

  private async trainWithDifferentialPrivacy(
    data: PersonalData[],
    privacyBudget: number
  ): Promise<PrivateModelUpdate> {
    const dp = new DifferentialPrivacy(privacyBudget);

    // Train model with privacy guarantees
    const weights = await this.trainModel(data);

    // Add noise to model weights
    const privateWeights = weights.map((w) => dp.addLaplaceNoise(w));

    return {
      weights: privateWeights,
      size: privateWeights.length,
      epsilonUsed: privacyBudget,
    };
  }
}
```

### 3. Zero-Knowledge Proofs

#### Privacy-Preserving Verification

```typescript
// Zero-knowledge proof implementation for privacy-preserving verification
class ZeroKnowledgeProof {
  // Prove knowledge without revealing the knowledge
  async proveAge(age: number, minimumAge: number): Promise<ZKProof> {
    if (age < minimumAge) {
      throw new Error('Age requirement not met');
    }

    // Generate commitment
    const commitment = await this.generateCommitment(age);

    // Generate proof
    const proof = await this.generateProof(age, minimumAge, commitment);

    return {
      commitment,
      proof,
      minimumAge,
      timestamp: new Date().toISOString(),
    };
  }

  // Verify proof without learning the actual age
  async verifyAgeProof(proof: ZKProof): Promise<boolean> {
    // Verify the proof without learning the actual age
    const isValid = await this.verifyProof(proof.proof, proof.commitment, proof.minimumAge);

    return isValid;
  }

  private async generateCommitment(value: number): Promise<string> {
    // Generate cryptographic commitment
    const encoded = new TextEncoder().encode(value.toString());
    const hash = await crypto.subtle.digest('SHA-256', encoded);
    return Buffer.from(hash).toString('base64');
  }

  private async generateProof(
    value: number,
    constraint: number,
    commitment: string
  ): Promise<string> {
    // Simplified zero-knowledge proof generation
    // Real implementation requires sophisticated cryptographic protocols
    const proofData = {
      value: value,
      constraint: constraint,
      commitment: commitment,
      random: crypto.getRandomValues(new Uint8Array(32)),
    };

    const encoded = new TextEncoder().encode(JSON.stringify(proofData));
    const hash = await crypto.subtle.digest('SHA-256', encoded);
    return Buffer.from(hash).toString('base64');
  }

  private async verifyProof(
    proof: string,
    commitment: string,
    constraint: number
  ): Promise<boolean> {
    // Simplified verification
    // Real implementation would verify mathematical properties
    return proof.length > 0 && commitment.length > 0;
  }
}
```

---

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

### Official GDPR Documentation

- [GDPR Official Text](https://gdpr-info.eu/)
- [European Data Protection Board](https://edpb.europa.eu/)
- [UK ICO GDPR Guidance](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-gdpr/)
- [European Commission GDPR Guidelines](https://ec.europa.eu/info/law/law-topic/data-protection/data-protection-en)

### Security and Privacy Frameworks

- [NIST Privacy Framework](https://www.nist.gov/privacy-framework)
- [ISO/IEC 27701 Privacy Information Management](https://www.iso.org/isoiec-27001-information-security-cybersecurity-and-privacy-protection.html)
- [OWASP Privacy Risks](https://owasp.org/www-project-top-ten/2021/A02_2021-Cryptographic_Failures/)
- [ENISA Data Protection Guidelines](https://www.enisa.europa.eu/topics/data-protection)

### Advanced Privacy Technologies

- [Differential Privacy Book](https://www.cis.upenn.edu/~aaroth/Papers/privacybook.pdf)
- [Homomorphic Encryption Standards](https://homomorphicencryption.org/)
- [Zero-Knowledge Proofs](https://zkproof.org/)
- [Federated Learning Research](https://federated-learning.org/)

### Compliance and Enforcement

- [GDPR Enforcement Tracker](https://enforcementtracker.com/)
- [EDPB Guidelines on DPIA](https://edpb.europa.eu/about-edpb/board-edpb/edpb-plenary/edpb-plenary-item-03-2021/)
- [Data Breach Notification Guidelines](https://edpb.europa.eu/about-edpb/board-edpb/edpb-plenary/edpb-plenary-item-04-2021/)
- [International Data Transfer Guidelines](https://edpb.europa.eu/about-edpb/board-edpb/edpb-plenary/edpb-plenary-item-02-2021/)


## Best Practices

[Add content here]


## Testing

[Add content here]
