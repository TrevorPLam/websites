---
title: "green-software-foundation-sci-spec.md"
description: "> The Software Carbon Intensity (SCI) specification is an ISO-accredited standard (ISO/IEC 21031:2024) that provides a methodology for calculating the carbon intensity of software applications. It ena..."
domain: development
type: how-to
layer: global
audience: ["developer"]
phase: 1
complexity: advanced
freshness_review: 2026-08-25
validation_status: unverified
last_updated: 2026-02-26
tags: ["development", "green-software-foundation-sci-spec.md"]
legacy_path: "standards-specs\green-software-foundation-sci-spec.md"
---
# green-software-foundation-sci-spec.md

# Green Software Foundation SCI Specification

> The Software Carbon Intensity (SCI) specification is an ISO-accredited standard (ISO/IEC 21031:2024) that provides a methodology for calculating the carbon intensity of software applications. It enables software practitioners to measure, compare, and reduce the carbon emissions associated with their software systems.

## Overview

The Software Carbon Intensity (SCI) specification, developed by the Green Software Foundation (GSF), is a standardized methodology for calculating the rate of carbon emissions for software systems. The SCI is a rate-based metric that measures carbon emissions per functional unit, enabling consistent comparison and tracking of software sustainability performance.

### Key Principles

- **Rate-Based Measurement**: SCI measures carbon emissions per functional unit (C per R), not total emissions
- **Emission Elimination Focus**: The SCI encourages actual emission reduction, not offsetting or neutralization
- **Universal Applicability**: Can be applied to any software system, from small libraries to large distributed systems
- **Evidence-Based Decisions**: Enables data-driven decisions for sustainable software development

### Purpose and Goals

The SCI specification aims to:

1. **Increase Awareness**: Provide transparency about software's carbon footprint
2. **Enable Comparison**: Allow consistent comparison between different software solutions
3. **Guide Decisions**: Help practitioners make informed choices about tools, architectures, and services
4. **Drive Reduction**: Encourage actions that eliminate rather than offset emissions
5. **Track Progress**: Enable measurement of sustainability improvements over time

## Core Concepts

### SCI Equation

The fundamental SCI equation is:

```
SCI = (O + M) per R
```

Where:

- **O** = Operational emissions (energy consumption × carbon intensity)
- **M** = Embodied emissions (hardware manufacturing and disposal)
- **R** = Functional unit (scaling metric)

### Components Explained

#### Operational Emissions (O)

Operational emissions are calculated as:

```
O = E × I
```

Where:

- **E** = Energy consumed by the software system (kWh)
- **I** = Region-specific carbon intensity (gCO₂eq/kWh)

#### Embodied Emissions (M)

Embodied emissions are calculated as:

```
M = TE × TS × RS
```

Where:

- **TE** = Total embodied emissions of hardware (gCO₂eq)
- **TS** = Time-share (fraction of hardware lifespan reserved for software)
- **RS** = Resource-share (fraction of hardware resources reserved for software)

#### Functional Unit (R)

The functional unit represents how the application scales. Common choices include:

- API call/request
- User
- Minute/time unit
- Device
- Data volume
- Transaction
- Machine

## Implementation Methodology

### Five-Step Process

#### 1. Bound: Define Software Boundary

Decide which software components to include in the calculation. The boundary should include:

**Required Components:**

- Compute resources
- Storage systems
- Networking equipment
- Memory
- Monitoring systems

**Optional Components (when significant):**

- Idle machines
- Logging systems
- Build and deploy pipelines
- Testing environments
- ML model training
- Backup systems
- Redundancy and failover resources
- End-user devices
- IoT and edge devices

#### 2. Scale: Choose Functional Unit

Select a functional unit (R) that best describes how the application scales. The choice must be consistent across all components.

**Guidelines for Selection:**

- Choose the unit that best represents business value
- Ensure data availability for measurement
- Maintain consistency across components
- Consider stakeholder communication needs

#### 3. Define: Select Quantification Method

For each software component, decide on the quantification approach:

**Measurement (Real-World Data):**

- Use actual operational data
- Measure total emissions over time period
- Divide by functional units in same period
- Higher accuracy but requires data access

**Calculation (Model-Based):**

- Model one functional unit execution
- Calculate emissions in controlled environment
- Use when real-world data unavailable
- Lower accuracy but more accessible

#### 4. Quantify: Calculate Component SCI

Calculate the SCI value for each software component using the chosen method.

**For Measurement:**

```
Component SCI = Total Measured Emissions / Total Functional Units
```

**For Calculation:**

```
Component SCI = Modeled Emissions per Functional Unit
```

#### 5. Report: Disclose Results

Report the complete SCI score with transparency about methodology.

**Required Disclosures:**

- Final SCI score
- Software boundary definition
- Functional unit used
- Quantification methods for each component
- Data sources and assumptions
- Calculation methodology details

## Detailed Calculations

### Operational Emissions Calculation

#### Energy Measurement (E)

**Units:** Kilowatt hours (kWh)

**Measurement Approaches:**

- **Direct Measurement**: Use power meters or cloud provider metrics
- **Estimation**: Use benchmark data or provider specifications
- **Modeling**: Use performance models and workload characteristics

**Considerations:**

- Include all energy for provisioned hardware, not just utilized
- Account for data center efficiency (PUE)
- Include cooling and supporting infrastructure energy

#### Carbon Intensity (I)

**Units:** Grams of CO₂ equivalent per kilowatt hour (gCO₂eq/kWh)

**Data Sources:**

- **Grid Intensity**: Use location-based grid emission factors
- **Provider Data**: Cloud provider carbon intensity reports
- **Regional Data**: Government or environmental agency data
- **Time-Based**: Use hourly or seasonal variations when available

**Important Notes:**

- Exclude market-based measures (renewable energy certificates)
- Use location-based factors for actual emissions
- Prefer marginal emission factors for decision-making

### Embodied Emissions Calculation

#### Total Embodied Emissions (TE)

**Sources:**

- Manufacturer Life Cycle Assessment (LCA) data
- Environmental Product Declarations (EPD)
- Industry average data
- Academic research studies

**Components to Include:**

- Manufacturing emissions
- Transportation emissions
- Installation emissions
- End-of-life disposal emissions

#### Time-Share Calculation (TS)

```
TS = Time Reserved / Expected Lifespan
```

**Example:**

- Time Reserved: 1 hour
- Expected Lifespan: 4 years (35,040 hours)
- TS = 1 / 35,040 = 0.0000285

#### Resource-Share Calculation (RS)

```
RS = Resources Reserved / Total Resources
```

**Common Metrics:**

- CPU percentage
- Memory percentage
- Storage percentage
- Network bandwidth percentage

## Software Sustainability Actions

### Three Action Categories

#### 1. Energy Efficiency

Actions to reduce electricity consumption for the same function:

**Code-Level:**

- Optimize algorithms and data structures
- Reduce computational complexity
- Implement efficient caching strategies
- Use energy-efficient programming languages

**System-Level:**

- Optimize database queries
- Implement efficient data compression
- Use appropriate data structures
- Minimize unnecessary computations

#### 2. Hardware Efficiency

Actions to use fewer physical resources:

**Architecture:**

- Serverless architectures
- Microservices with proper sizing
- Container optimization
- Resource pooling and sharing

**Infrastructure:**

- Right-sizing instances
- Auto-scaling policies
- Load optimization
- Efficient resource allocation

#### 3. Carbon Awareness

Actions to shift computation to cleaner energy sources:

**Temporal Shifting:**

- Schedule batch jobs during low-carbon periods
- Delay non-urgent processing
- Time-based workload distribution

**Geographic Shifting:**

- Route requests to low-carbon regions
- Deploy services in clean energy locations
- Regional workload distribution

**Hybrid Approaches:**

- Combine temporal and geographic strategies
- Dynamic routing based on carbon intensity
- Intelligent workload placement

## Role-Specific Guidance

### Software Programmers

- Write energy-efficient code
- Optimize algorithms for performance
- Minimize unnecessary computations
- Choose appropriate data structures

### AI/ML Developers

- Optimize model architectures
- Use pre-trained models when possible
- Leverage optimized hardware
- Implement efficient training strategies

### Database Engineers

- Optimize schema design
- Choose appropriate storage engines
- Implement query optimization
- Use efficient indexing strategies

### DevOps Practitioners

- Create carbon-aware pipelines
- Schedule builds during clean energy periods
- Optimize infrastructure utilization
- Implement efficient monitoring

### QA Engineers

- Create energy-efficient test automation
- Optimize performance testing
- Test across different energy profiles
- Validate carbon-aware features

### Architects

- Design for carbon awareness
- Choose appropriate architectures
- Optimize infrastructure design
- Plan for energy efficiency

## Data Collection and Measurement

### Energy Data Sources

**Cloud Providers:**

- AWS Cost and Usage Reports
- Azure Carbon Optimization
- Google Cloud Carbon Footprint
- Provider-specific APIs

**On-Premise:**

- Power monitoring tools
- Smart PDUs
- Building management systems
- Utility meters

**Third-Party Tools:**

- Cloud carbon footprint tools
- Energy monitoring platforms
- Sustainability dashboards

### Carbon Intensity Data

**Official Sources:**

- EPA eGRID (United States)
- IEA Emission Factors (International)
- DEFRA Conversion Factors (UK)
- European Environment Agency

**Real-Time Data:**

- ElectricityMap
- Tomorrow (carbon intensity API)
- Provider-specific real-time data

**Historical Data:**

- Government databases
- Academic research
- Industry reports

## Reporting and Communication

### SCI Score Presentation

**Basic Format:**

```
SCI Score: X gCO₂eq per [functional unit]
```

**Enhanced Reporting:**

- Component breakdown
- Methodology description
- Data quality indicators
- Trend analysis
- Comparison to baseline

### Stakeholder Communication

**Technical Audiences:**

- Detailed methodology
- Data sources and assumptions
- Calculation transparency
- Uncertainty analysis

**Business Audiences:**

- Executive summary
- Business impact
- Cost implications
- Improvement opportunities

**Public Communication:**

- Simplified metrics
- Progress tracking
- Sustainability commitments
- Comparative performance

## Quality Assurance and Validation

### Data Quality Checks

**Completeness:**

- All required components included
- Data gaps identified and addressed
- Assumptions clearly documented

**Consistency:**

- Functional units consistent across components
- Time periods aligned
- Calculation methods standardized

**Accuracy:**

- Data sources validated
- Calculations verified
- Results cross-checked

### Validation Approaches

**Internal Validation:**

- Peer review of calculations
- Cross-functional verification
- Tool validation

**External Validation:**

- Third-party audit
- Industry benchmarking
- Standard compliance verification

## Continuous Improvement

### Monitoring and Tracking

**Regular Measurement:**

- Establish baseline SCI score
- Track changes over time
- Identify improvement opportunities
- Monitor progress against targets

**Performance Indicators:**

- SCI score trends
- Component contribution analysis
- Efficiency improvements
- Cost-benefit analysis

### Improvement Strategies

**Short-Term Actions:**

- Quick wins in energy efficiency
- Low-cost optimization opportunities
- Immediate carbon awareness improvements

**Long-Term Strategies:**

- Architecture redesign
- Technology migration
- Process optimization
- Cultural change initiatives

## Integration with Other Standards

### Complementary Standards

**ISO 14064:** Greenhouse gas accounting
**ISO 50001:** Energy management
**GHG Protocol:** Corporate accounting
**TCFD:** Climate-related financial disclosure

### Industry Frameworks

**GRI:** Sustainability reporting
**SASB:** Industry-specific standards
**CDP:** Environmental disclosure
**TCFD:** Climate risk reporting

## Tools and Resources

### Calculation Tools

**Open Source:**

- GSF SCI Calculator
- Cloud Carbon Footprint tools
- Custom spreadsheet templates

**Commercial Tools:**

- Sustainability platforms
- Cloud provider tools
- Third-party carbon calculators

### Data Resources

**Carbon Intensity Data:**

- ElectricityMap
- Tomorrow API
- Government databases
- Provider-specific data

**Embodied Emissions Data:**

- Product environmental declarations
- LCA databases
- Industry average data
- Manufacturer specifications

## Implementation Challenges

### Common Challenges

**Data Availability:**

- Limited access to energy data
- Missing carbon intensity information
- Incomplete embodied emissions data

**Calculation Complexity:**

- Multi-component systems
- Dynamic workloads
- Distributed architectures

**Organizational Barriers:**

- Lack of awareness
- Resource constraints
- Competing priorities

### Mitigation Strategies

**Data Challenges:**

- Use estimation methods when data unavailable
- Work with providers for better data access
- Implement monitoring and measurement systems

**Complexity Management:**

- Start with simple boundaries
- Use automated tools
- Phase implementation

**Organizational Change:**

- Executive sponsorship
- Education and training
- Incentive alignment

## References

- [Research Inventory](../../tasks/RESEARCH-INVENTORY.md) — Internal patterns

- [Software Carbon Intensity (SCI) Specification](https://sci.greensoftware.foundation/)
- [Green Software Foundation](https://greensoftware.foundation/)
- [ISO/IEC 21031:2024 Standard](https://www.iso.org/standard/86612.html)
- [SCI Specification GitHub Repository](https://github.com/Green-Software-Foundation/sci)
- [GSF SCI Calculator](https://calculator.greensoftware.foundation/)
- [ElectricityMap Real-Time Carbon Data](https://www.electricitymaps.com/)
- [Tomorrow Carbon Intensity API](https://www.tomorrow.io/)
- [EPA eGRID Database](https://www.epa.gov/egrid)
- [IEA Emission Factors](https://www.iea.org/data-and-statistics/data-products)

## Best Practices

[Add content here]

## Testing

[Add content here]