# Security Standards Mapping

This matrix maps repository security requirements to common frameworks.

| Requirement                                | OWASP ASVS                                   | NIST SSDF (SP 800-218) | GDPR                  |
| ------------------------------------------ | -------------------------------------------- | ---------------------- | --------------------- |
| Tenant isolation in data access            | V4 Access Control                            | PW.4, RV.1             | Art. 25, Art. 32      |
| Input validation for external data         | V5 Validation, Sanitization                  | PW.5                   | Art. 5(1)(d)          |
| Authentication and role authorization      | V2 Authentication, V4 Access Control         | PO.3, PW.4             | Art. 32               |
| Secret handling and no plaintext leakage   | V6 Stored Cryptography, V9 Communications    | PS.3, PW.6             | Art. 32               |
| Security headers and browser hardening     | V14 Config                                   | PW.6, RV.3             | Art. 32               |
| Dependency and SAST scanning in CI         | V1 Architecture & Design, V10 Malicious Code | PO.1, PW.7, RV.1       | Art. 24, Art. 32      |
| Auditable monitoring and incident response | V7 Error Handling & Logging                  | RV.3, RV.4             | Art. 33, Art. 34      |
| Data minimization and deletion workflows   | V1 Governance                                | PO.1, RV.2             | Art. 5(1)(c), Art. 17 |
