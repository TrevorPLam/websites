# sci-calculation-examples.md

# SCI Calculation Examples

> Practical examples and walkthroughs for calculating Software Carbon Intensity (SCI) scores using the formula SCI = (E × I + M) per R. These examples demonstrate real-world applications of the SCI specification across different software systems and scenarios.

## Introduction

The Software Carbon Intensity (SCI) calculation follows the standardized formula:

```
SCI = (E × I + M) per R
```

Where:

- **E** = Energy consumed by the software (kWh)
- **I** = Grid carbon intensity (gCO₂eq/kWh)
- **M** = Embodied emissions of hardware (gCO₂eq)
- **R** = Functional unit (e.g., API request, user, transaction)

This document provides practical calculation examples for various software systems, from simple APIs to complex distributed applications.

## Example 1: Web API Service

### Scenario

A REST API service running on a cloud virtual machine that processes user requests.

### System Details

- **Deployment**: Single VM in AWS us-east-1 (Virginia)
- **Runtime**: 24-hour period
- **Load**: 10,000 API requests processed
- **Hardware**: t3.medium instance (2 vCPU, 4 GB RAM)

### Data Collection

#### Energy Consumption (E)

Using AWS CloudWatch metrics:

- CPU utilization: 15% average
- Instance power draw: 45W at 15% utilization
- Total energy: 45W × 24h = 1,080Wh = 1.08 kWh

#### Carbon Intensity (I)

Grid carbon intensity for Virginia (us-east-1):

- Source: EPA eGRID 2023 data
- Value: 380 gCO₂eq/kWh

#### Embodied Emissions (M)

VM embodied emissions calculation:

- Server manufacturing emissions: 1,200 kgCO₂eq
- Server lifespan: 4 years (35,040 hours)
- Time-share: 24 hours / 35,040 hours = 0.000685
- Resource-share: 15% CPU utilization = 0.15
- M = 1,200,000 g × 0.000685 × 0.15 = 123.3 gCO₂eq

#### Functional Unit (R)

- R = 10,000 API requests

### Calculation

```
Operational Emissions (O) = E × I
O = 1.08 kWh × 380 gCO₂eq/kWh = 410.4 gCO₂eq

Total Emissions = O + M
Total = 410.4 + 123.3 = 533.7 gCO₂eq

SCI = Total Emissions / R
SCI = 533.7 gCO₂eq / 10,000 requests
SCI = 0.053 gCO₂eq per request
```

### Results

- **SCI Score**: 0.053 gCO₂eq per API request
- **Operational Emissions**: 77% of total
- **Embodied Emissions**: 23% of total

## Example 2: Machine Learning Training Pipeline

### Scenario

Training a machine learning model on a GPU-enabled instance.

### System Details

- **Deployment**: AWS p3.2xlarge (1 GPU, 8 vCPU, 61 GB RAM)
- **Training Duration**: 6 hours
- **Model**: Image classification neural network
- **Dataset**: 50,000 training images

### Data Collection

#### Energy Consumption (E)

GPU instance power consumption:

- Peak power: 1,200W
- Average utilization: 85%
- Total energy: 1,200W × 0.85 × 6h = 6,120Wh = 6.12 kWh

#### Carbon Intensity (I)

Training in Oregon (us-west-2):

- Grid intensity: 240 gCO₂eq/kWh (cleaner grid)

#### Embodied Emissions (M)

GPU instance embodied emissions:

- GPU manufacturing emissions: 3,500 kgCO₂eq
- Server manufacturing emissions: 1,200 kgCO₂eq
- Total hardware emissions: 4,700 kgCO₂eq
- Time-share: 6 hours / 35,040 hours = 0.000171
- Resource-share: 85% utilization = 0.85
- M = 4,700,000 g × 0.000171 × 0.85 = 683.6 gCO₂eq

#### Functional Unit (R)

- R = 1 complete model training run

### Calculation

```
Operational Emissions (O) = E × I
O = 6.12 kWh × 240 gCO₂eq/kWh = 1,468.8 gCO₂eq

Total Emissions = O + M
Total = 1,468.8 + 683.6 = 2,152.4 gCO₂eq

SCI = Total Emissions / R
SCI = 2,152.4 gCO₂eq per training run
```

### Results

- **SCI Score**: 2,152.4 gCO₂eq per training run
- **Operational Emissions**: 68% of total
- **Embodied Emissions**: 32% of total

## Example 3: Serverless Function

### Scenario

AWS Lambda function processing image thumbnails.

### System Details

- **Function**: Image thumbnail generation
- **Runtime**: 100ms average execution time
- **Memory**: 512 MB allocation
- **Monthly Volume**: 1,000,000 invocations
- **Region**: AWS eu-west-1 (Ireland)

### Data Collection

#### Energy Consumption (E)

Lambda energy calculation:

- Power consumption: 0.8W per 512MB
- Execution time: 0.1s average
- Energy per invocation: 0.8W × 0.1s = 0.08Wh = 0.00008 kWh
- Total monthly energy: 0.00008 kWh × 1,000,000 = 80 kWh

#### Carbon Intensity (I)

Ireland grid carbon intensity:

- Source: SEAI (Sustainable Energy Authority of Ireland)
- Value: 300 gCO₂eq/kWh

#### Embodied Emissions (M)

Serverless embodied emissions (complex):

- AWS data center embodied emissions amortized
- Estimated: 0.01 gCO₂eq per invocation
- Total M: 0.01 g × 1,000,000 = 10,000 gCO₂eq

#### Functional Unit (R)

- R = 1,000,000 function invocations

### Calculation

```
Operational Emissions (O) = E × I
O = 80 kWh × 300 gCO₂eq/kWh = 24,000 gCO₂eq

Total Emissions = O + M
Total = 24,000 + 10,000 = 34,000 gCO₂eq

SCI = Total Emissions / R
SCI = 34,000 gCO₂eq / 1,000,000 invocations
SCI = 0.034 gCO₂eq per invocation
```

### Results

- **SCI Score**: 0.034 gCO₂eq per function invocation
- **Operational Emissions**: 71% of total
- **Embodied Emissions**: 29% of total

## Example 4: Mobile Application Backend

### Scenario

Backend services for a mobile app with 100,000 active users.

### System Details

- **Architecture**: Microservices on Kubernetes cluster
- **Nodes**: 3 nodes (4 vCPU, 16 GB RAM each)
- **Services**: API, database, caching, file storage
- **Monthly Period**: 30 days
- **Active Users**: 100,000

### Data Collection

#### Energy Consumption (E)

Cluster energy consumption:

- Node power: 80W average per node
- Total cluster power: 80W × 3 = 240W
- Monthly energy: 240W × 24h × 30 days = 172,800Wh = 172.8 kWh

#### Carbon Intensity (I)

Deployed in Germany (eu-central-1):

- Grid intensity: 400 gCO₂eq/kWh

#### Embodied Emissions (M)

Kubernetes cluster embodied emissions:

- Server emissions: 1,200 kgCO₂eq × 3 = 3,600 kgCO₂eq
- Network equipment: 800 kgCO₂eq
- Total hardware emissions: 4,400 kgCO₂eq
- Time-share: 30 days / (4 years × 365 days) = 0.0205
- Resource-share: 60% average cluster utilization = 0.60
- M = 4,400,000 g × 0.0205 × 0.60 = 54,120 gCO₂eq

#### Functional Unit (R)

- R = 100,000 active users per month

### Calculation

```
Operational Emissions (O) = E × I
O = 172.8 kWh × 400 gCO₂eq/kWh = 69,120 gCO₂eq

Total Emissions = O + M
Total = 69,120 + 54,120 = 123,240 gCO₂eq

SCI = Total Emissions / R
SCI = 123,240 gCO₂eq / 100,000 users
SCI = 1.23 gCO₂eq per user per month
```

### Results

- **SCI Score**: 1.23 gCO₂eq per user per month
- **Operational Emissions**: 56% of total
- **Embodied Emissions**: 44% of total

## Example 5: Data Processing Pipeline

### Scenario

ETL pipeline processing 1 TB of data daily.

### System Details

- **Architecture**: Apache Spark on cloud instances
- **Instances**: 4 workers (8 vCPU, 32 GB RAM each)
- **Processing Time**: 4 hours daily
- **Data Volume**: 1 TB per day
- **Region**: Canada (ca-central-1)

### Data Collection

#### Energy Consumption (E)

Spark cluster energy consumption:

- Worker power: 150W average per worker
- Total cluster power: 150W × 4 = 600W
- Daily energy: 600W × 4h = 2,400Wh = 2.4 kWh
- Monthly energy (30 days): 2.4 kWh × 30 = 72 kWh

#### Carbon Intensity (I)

Canada grid carbon intensity:

- Source: Environment Canada
- Value: 120 gCO₂eq/kWh (low-carbon grid)

#### Embodied Emissions (M)

Spark cluster embodied emissions:

- Server emissions: 1,200 kgCO₂eq × 4 = 4,800 kgCO₂eq
- Network storage: 600 kgCO₂eq
- Total hardware emissions: 5,400 kgCO₂eq
- Time-share: 4h × 30 days / (4 years × 365 days × 24h) = 0.0137
- Resource-share: 80% cluster utilization = 0.80
- M = 5,400,000 g × 0.0137 × 0.80 = 59,184 gCO₂eq

#### Functional Unit (R)

- R = 1 TB of data processed

### Calculation

```
Operational Emissions (O) = E × I
O = 72 kWh × 120 gCO₂eq/kWh = 8,640 gCO₂eq

Total Emissions = O + M
Total = 8,640 + 59,184 = 67,824 gCO₂eq

SCI = Total Emissions / R
SCI = 67,824 gCO₂eq / 30 TB
SCI = 2,260.8 gCO₂eq per TB
```

### Results

- **SCI Score**: 2,260.8 gCO₂eq per TB processed
- **Operational Emissions**: 13% of total
- **Embodied Emissions**: 87% of total

## Comparative Analysis

### Cross-Example Comparison

| System         | Functional Unit | SCI Score      | Operational % | Embodied % |
| -------------- | --------------- | -------------- | ------------- | ---------- |
| Web API        | per request     | 0.053 gCO₂eq   | 77%           | 23%        |
| ML Training    | per training    | 2,152.4 gCO₂eq | 68%           | 32%        |
| Serverless     | per invocation  | 0.034 gCO₂eq   | 71%           | 29%        |
| Mobile Backend | per user/month  | 1.23 gCO₂eq    | 56%           | 44%        |
| Data Pipeline  | per TB          | 2,260.8 gCO₂eq | 13%           | 87%        |

### Key Insights

1. **Serverless Efficiency**: Serverless functions show the lowest per-operation emissions
2. **Embodied Dominance**: Long-running infrastructure has high embodied emission ratios
3. **Grid Impact**: Carbon intensity varies significantly by region (120-400 gCO₂eq/kWh)
4. **Scale Effects**: Per-unit efficiency improves with higher utilization

## Optimization Scenarios

### Scenario A: Region Migration

**Baseline**: Web API in Virginia (380 gCO₂eq/kWh)
**Optimized**: Same API in Canada (120 gCO₂eq/kWh)

```
Before: SCI = 0.053 gCO₂eq per request
After: SCI = (1.08 × 120 + 123.3) / 10,000 = 0.025 gCO₂eq per request
Improvement: 53% reduction
```

### Scenario B: Efficiency Improvements

**Baseline**: ML training with 85% GPU utilization
**Optimized**: Improved algorithm reduces training time to 4 hours

```
Before: SCI = 2,152.4 gCO₂eq per training
After: Energy = 1,200W × 0.85 × 4h = 4.08 kWh
After: SCI = (4.08 × 240 + 455.7) / 1 = 1,435.7 gCO₂eq per training
Improvement: 33% reduction
```

### Scenario C: Hardware Optimization

**Baseline**: t3.medium instance (45W at 15% utilization)
**Optimized**: t3.nano instance (20W at 30% utilization)

```
Before: Energy = 45W × 0.15 × 24h = 1.08 kWh
After: Energy = 20W × 0.30 × 24h = 1.44 kWh
After: SCI = (1.44 × 380 + 82.2) / 10,000 = 0.063 gCO₂eq per request
Result: 19% increase (smaller instance less efficient)
```

## Data Sources and References

### Energy Consumption Data

**Cloud Providers:**

- AWS Cost and Usage Reports
- Azure Carbon Optimization
- Google Cloud Carbon Footprint

**Hardware Specifications:**

- Intel Power Data
- AMD Power Profiles
- ARM Power Efficiency Reports

### Carbon Intensity Data

**Official Sources:**

- EPA eGRID (United States)
- IEA Emission Factors (International)
- European Environment Agency
- Environment Canada
- SEAI (Ireland)

**Real-Time Data:**

- ElectricityMap
- Tomorrow API
- WattTime

### Embodied Emissions Data

**LCA Databases:**

- Ecoinvent Database
- GaBi Database
- OpenLCA Nexus

**Manufacturer Data:**

- Dell Environmental Reports
- HP Sustainability Reports
- Cisco Environmental Data

## Implementation Checklist

### Data Collection Requirements

- [ ] Energy consumption measurements (kWh)
- [ ] Grid carbon intensity values (gCO₂eq/kWh)
- [ ] Hardware embodied emissions (gCO₂eq)
- [ ] Utilization metrics (CPU, memory, storage)
- [ ] Functional unit definitions
- [ ] Time period boundaries

### Calculation Steps

- [ ] Define software boundaries
- [ ] Select functional unit (R)
- [ ] Measure energy consumption (E)
- [ ] Obtain carbon intensity (I)
- [ ] Calculate embodied emissions (M)
- [ ] Apply SCI formula
- [ ] Validate results

### Quality Assurance

- [ ] Cross-check data sources
- [ ] Validate calculation methodology
- [ ] Review assumptions
- [ ] Document uncertainties
- [ ] Peer review results

## Tools and Automation

### Calculation Tools

**Open Source:**

- GSF SCI Calculator
- Cloud Carbon Footprint
- Custom Python scripts

**Commercial:**

- Scope3 Emissions Calculator
- Watershed Carbon Platform
- Normative Impact Tracker

### Automation Scripts

```python
# Example SCI calculation script
def calculate_sci(energy_kwh, carbon_intensity, embodied_g, functional_units):
    operational_emissions = energy_kwh * carbon_intensity
    total_emissions = operational_emissions + embodied_g
    sci_score = total_emissions / functional_units
    return sci_score

# Usage
sci = calculate_sci(
    energy_kwh=1.08,
    carbon_intensity=380,
    embodied_g=123.3,
    functional_units=10000
)
print(f"SCI Score: {sci:.3f} gCO₂eq per functional unit")
```

### Monitoring Integration

**CI/CD Pipeline Integration:**

- Automated SCI calculation on deployment
- Trend analysis across releases
- Alert thresholds for SCI increases

**Dashboard Integration:**

- Real-time SCI tracking
- Comparative analysis
- Optimization recommendations

## Conclusion

These examples demonstrate the practical application of the SCI specification across diverse software systems. Key takeaways include:

1. **Data Quality Matters**: Accurate energy and carbon data is essential
2. **Context is Critical**: SCI scores must be interpreted within system context
3. **Optimization Opportunities**: Multiple levers exist for SCI reduction
4. **Comparative Analysis**: SCI enables meaningful comparisons between systems
5. **Continuous Improvement**: Regular measurement drives optimization

By following these examples and methodologies, organizations can effectively measure and reduce their software carbon footprint while maintaining performance and functionality.

## References

- [Software Carbon Intensity Specification](https://sci.greensoftware.foundation/)
- [Green Software Foundation](https://greensoftware.foundation/)
- [AWS Customer Carbon Footprint Tool](https://aws.amazon.com/customer-carbon-footprint/)
- [Google Cloud Carbon Footprint](https://cloud.google.com/carbon-footprint)
- [Microsoft Sustainability Calculator](https://www.microsoft.com/en-us/sustainability)
- [EPA eGRID Database](https://www.epa.gov/egrid)
- [ElectricityMap Real-Time Data](https://www.electricitymaps.com/)
- [Thoughtworks SCI Calculation Guide](https://www.thoughtworks.com/insights/blog/ethical-tech/calculating-software-carbon-intensity)
- [Green Agile SCI Framework](https://greenagile.org/metrics-and-impact/code-build-and-cicd/sci)
