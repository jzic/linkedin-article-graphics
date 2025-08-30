# QA Validation Plan for EQUIAM LinkedIn Bubble Charts
**Date:** August 29, 2025  
**Sectors:** AI, Space Tech, Robotics & Automation, Defense Tech, Quantum Computing, Cybersecurity

## Executive Summary
This document outlines a comprehensive Quality Assurance plan for validating sector bubble charts used in EQUIAM's LinkedIn content. The plan ensures accuracy, completeness, and defensibility of all data points, valuations, and growth projections.

## 1. SECTOR COMPOSITION VALIDATION

### 1.1 Inclusion/Exclusion Criteria
For each sector, validate:
- **Glaring Omissions**: Companies that sector experts would expect to see
- **Questionable Inclusions**: Companies that don't primarily operate in the sector
- **Edge Cases**: Companies with partial sector exposure requiring allocation analysis

### 1.2 Company Classification Framework
| Criteria | Threshold | Action |
|----------|-----------|--------|
| Primary Revenue from Sector | >50% | Include at 100% |
| Significant Revenue from Sector | 20-50% | Include at weighted % |
| Minor Revenue from Sector | <20% | Exclude or note separately |
| Pure-Play Companies | 80%+ | Priority inclusion |
| Conglomerates | Varies | Require allocation analysis |

### 1.3 Sector-Specific Review Points

#### AI Sector
- Focus on companies with core AI/ML products or services
- Exclude companies merely using AI as a tool
- Include infrastructure providers (chips, cloud) with allocation

#### Space Technology
- Commercial space operations vs. traditional aerospace
- Satellite operators vs. manufacturers
- Launch providers vs. payload companies

#### Robotics & Automation
- Industrial vs. consumer robotics
- Autonomous vehicles as subset
- Software vs. hardware focus

#### Defense Technology
- Modern defense tech vs. traditional contractors
- Dual-use technology companies
- Export control considerations

#### Quantum Computing
- Hardware vs. software companies
- Research stage vs. commercial products
- Classical computing companies with quantum divisions

#### Cybersecurity
- Pure-play security vs. broader IT companies
- Product vs. services companies
- Cloud security vs. traditional security

## 2. VALUATION VERIFICATION FRAMEWORK

### 2.1 Data Sources Hierarchy
1. **Primary Sources** (Most Reliable)
   - SEC filings (10-K, 10-Q, 8-K)
   - Official company investor relations pages
   - Exchange data (NYSE, NASDAQ)

2. **Secondary Sources** (Reliable)
   - Bloomberg Terminal
   - Reuters/Refinitiv
   - S&P Capital IQ
   - PitchBook

3. **Tertiary Sources** (Use with Caution)
   - TechCrunch/Crunchbase
   - News articles
   - Industry reports

### 2.2 Validation Requirements
- **Public Companies**: Market cap as of August 29, 2025 (close of market)
- **Private Companies**: Most recent funding round valuation
- **Date Cutoff**: Valuations must be from 2024-2025
- **Currency**: All values in USD billions

### 2.3 CSV Data Structure
Each sector CSV will contain:
```csv
company_name,ticker,type,valuation_billions,valuation_date,source,confidence_level,sector_allocation_pct,notes
```

## 3. REVENUE ALLOCATION ANALYSIS

### 3.1 Bottoms-Up Framework for Public Companies
For each public company, determine:
1. **Total Revenue** (latest fiscal year)
2. **Segment Breakdown** (from 10-K segment reporting)
3. **Sector-Attributable Revenue** (calculated)
4. **Allocation Percentage** (sector revenue / total revenue)
5. **Adjusted Market Cap** (market cap × allocation %)

### 3.2 Data Collection Template
| Company | Total Rev | Sector Rev | Allocation % | Market Cap | Adjusted Cap |
|---------|-----------|------------|--------------|------------|--------------|
| Example | $100B | $25B | 25% | $500B | $125B |

### 3.3 Special Considerations
- **Microsoft**: Separate Azure AI, GitHub Copilot, OpenAI investment
- **Google**: Separate Cloud AI, DeepMind, Waymo
- **Amazon**: AWS AI services, Robotics division
- **Meta**: AI research, Reality Labs

## 4. GROWTH RATE PROJECTIONS

### 4.1 5-Year CAGR Methodology

#### Public Companies
1. **Historical Analysis**: 3-5 year historical CAGR
2. **Analyst Consensus**: Average of major bank projections
3. **Industry Reports**: Gartner, IDC, McKinsey sector forecasts
4. **Weighted Average**: Combine sources with confidence weights

#### Private Companies
1. **Funding Growth**: Valuation growth between rounds
2. **Revenue Multiple**: Based on comparable public companies
3. **Industry Benchmarks**: Top quartile growth rates
4. **Technology Maturity**: Adjust for S-curve adoption

### 4.2 CAGR Validation Framework
| Growth Rate | Classification | Validation Required |
|-------------|---------------|-------------------|
| >100% | Hyper-growth | Multiple sources + justification |
| 50-100% | High growth | 2+ corroborating sources |
| 25-50% | Moderate-high | Industry average comparison |
| 10-25% | Moderate | Standard validation |
| <10% | Low/Mature | Explain if surprising |

### 4.3 Expected CAGR Ranges by Sector
- **AI**: Public 15-25%, Private 50-150%
- **Space Tech**: Public 5-10%, Private 30-60%
- **Robotics**: Public 10-20%, Private 40-80%
- **Defense Tech**: Public 3-8%, Private 60-120%
- **Quantum**: Public 20-40%, Private 80-200%
- **Cybersecurity**: Public 10-15%, Private 30-60%

## 5. QUALITY ASSURANCE CHECKLIST

### 5.1 Pre-Publication Checklist
- [ ] All market caps verified within 48 hours
- [ ] Private valuations from rounds within 12 months
- [ ] Revenue allocations documented for multi-sector companies
- [ ] Growth rates supported by 2+ sources
- [ ] Total addressable market (TAM) validated
- [ ] Private market percentage calculation verified
- [ ] Peer review by sector expert completed
- [ ] Legal/compliance review if needed

### 5.2 Red Flags Requiring Investigation
- Market cap changes >20% from last check
- Private valuations >2 years old
- Growth rates >200% or negative for growing sectors
- Missing major players identified by competitors
- Allocation percentages that seem inconsistent with revenue

## 6. CURRENT BUBBLE CHART DATA (AS IMPLEMENTED)

### 6.1 ARTIFICIAL INTELLIGENCE SECTOR
**File:** `lib/visualizations/ai-bubble-chart.ts`

#### Public Companies (18 total)
| Company | Market Cap ($B) | Ticker | Notes |
|---------|----------------|--------|-------|
| NVIDIA | 4,400 | NVDA | AI chips dominance |
| Microsoft | 3,900 | MSFT | Azure AI, OpenAI partnership |
| Apple | 3,400 | AAPL | On-device AI |
| Google | 2,500 | GOOGL | DeepMind, Gemini |
| Amazon | 2,500 | AMZN | AWS AI services |
| Meta | 1,900 | META | Llama, AI research |
| Broadcom | 1,400 | AVGO | AI infrastructure |
| Tesla | 1,100 | TSLA | FSD, Dojo |
| Oracle | 650 | ORCL | Cloud AI |
| Palantir | 385 | PLTR | AI analytics |
| AMD | 280 | AMD | AI chips |
| ServiceNow | 180 | NOW | Enterprise AI |
| AppLovin | 150 | APP | Mobile AI |
| Snowflake | 65 | SNOW | Data cloud |
| CoreWeave | 45 | Private | GPU cloud |
| Datadog | 45 | DDOG | Observability |
| Astera Labs | 30 | ALAB | AI connectivity |
| Tempus | 14 | TEM | AI healthcare |
| C3.ai | 2.3 | AI | Enterprise AI |

#### Private Companies (20 total)
| Company | Valuation ($B) | Notes |
|---------|---------------|-------|
| OpenAI | 500 | ChatGPT, GPT-4 |
| Anthropic | 170 | Claude |
| Databricks | 100 | Data + AI |
| SSI | 32 | Safe superintelligence |
| Perplexity | 20 | AI search |
| Thinking Machines | 12 | Infrastructure |
| Midjourney | 10 | Image generation |
| Anysphere | 9.9 | Cursor IDE |
| Glean | 7.2 | Enterprise search |
| Mistral | 6 | European LLM |
| Cohere | 5.5 | Enterprise LLM |
| SambaNova | 5.1 | AI hardware |
| Harvey | 5 | Legal AI |
| Hugging Face | 4.5 | AI community |
| Cerebras | 4.1 | AI chips |
| OpenEvidence | 3.5 | Medical AI |
| ElevenLabs | 3.3 | Voice AI |
| Groq | 2.8 | Fast inference |
| Lovable | 1.8 | AI development |
| Runway | 1.5 | Video AI |

### 6.2 SPACE TECHNOLOGY SECTOR
**File:** `lib/visualizations/space-tech-bubble-chart.ts`

#### Public Companies (15 total)
| Company | Market Cap ($B) | Ticker | Notes |
|---------|----------------|--------|-------|
| Lockheed Martin | 106 | LMT | Defense/space |
| General Dynamics | 86 | GD | Defense/space |
| Northrop Grumman | 84 | NOC | Defense/space |
| Thales | 56 | HO.PA | European defense |
| L3Harris | 52 | LHX | Defense tech |
| Rocket Lab | 23 | RKLB | Small launch |
| AST SpaceMobile | 16 | ASTS | Satellite phones |
| EchoStar | 8.6 | SATS | Satellite comm |
| Firefly | 6.6 | Private | Launch provider |
| Viasat | 3.8 | VSAT | Satellite internet |
| Iridium | 2.6 | IRDM | Satellite comm |
| Planet Labs | 2.1 | PL | Earth imaging |
| Intuitive Machines | 1.6 | LUNR | Lunar landers |
| Redwire | 1.3 | RDW | Space infrastructure |
| Astroscale | 0.62 | Private | Debris removal |
| Virgin Galactic | 0.18 | SPCE | Space tourism |

#### Private Companies (13 total)
| Company | Valuation ($B) | Notes |
|---------|---------------|-------|
| SpaceX | 400 | Launch, Starlink |
| Blue Origin | 75 | Launch, lunar |
| Sierra Space | 5.3 | Space planes |
| Relativity Space | 4.2 | 3D printed rockets |
| ABL Space | 2.4 | Small launch |
| Axiom Space | 2.2 | Space stations |
| Astranis | 1.6 | Small GEO sats |
| Impulse Space | 1.0 | Space tugs |
| Loft Orbital | 0.6 | Satellite services |
| Varda Space | 0.5 | Space manufacturing |
| Stoke Space | 0.4 | Reusable rockets |
| Astrobotic | 0.3 | Lunar landers |
| Orbex | 0.2 | UK launch |

### 6.3 ROBOTICS & AUTOMATION SECTOR
**File:** `lib/visualizations/robotics-bubble-chart.ts`

#### Public Companies (16 total)
| Company | Market Cap ($B) | Ticker | Notes |
|---------|----------------|--------|-------|
| Tesla | 1,100 | TSLA | Autonomy, Optimus |
| ASML | 278 | ASML | Semiconductor equipment |
| ABB | 125 | ABB | Industrial automation |
| Intuitive Surgical | 135 | ISRG | Surgical robots |
| Deere | 115 | DE | Autonomous farming |
| Rockwell | 31 | ROK | Factory automation |
| Zebra Technologies | 14 | ZBRA | Warehouse automation |
| Teradyne | 18 | TER | Test automation |
| Cognex | 5.8 | CGNX | Machine vision |
| AeroVironment | 5.5 | AVAV | Military drones |
| Symbotic | 22 | SYM | Warehouse robotics |
| Desktop Metal | 0.065 | DM | 3D printing |
| Sarcos | 0.02 | Private | Exoskeletons |
| Berkshire Grey | 0.03 | BGRY | Warehouse AI |
| Brooks Automation | 3.8 | BRKS | Semiconductor automation |
| Harmonic Drive | 2.8 | 6324.T | Robot components |

#### Private Companies (10 total)
| Company | Valuation ($B) | Notes |
|---------|---------------|-------|
| Skild AI | 4.0 | General robotics AI |
| Figure AI | 2.6 | Humanoid robots |
| Physical Intelligence | 2.4 | Robot foundation models |
| Apptronik | 1.4 | Humanoid robots |
| 1X Technologies | 0.5 | Humanoid robots |
| Agility Robotics | 0.15 | Bipedal robots |
| Carbon Robotics | 0.15 | Agricultural robots |
| Collaborative Robotics | 0.1 | Cobots |
| Iron Ox | 0.1 | Farming robots |
| Canvas | 0.08 | Construction robots |

### 6.4 DEFENSE TECHNOLOGY SECTOR
**File:** `lib/visualizations/defense-tech-bubble-chart.ts`

#### Public Companies (17 total)
| Company | Market Cap ($B) | Ticker | Notes |
|---------|----------------|--------|-------|
| RTX (Raytheon) | 165 | RTX | Missiles, defense |
| Boeing | 109 | BA | Aircraft, defense |
| Honeywell | 147 | HON | Aerospace systems |
| Lockheed Martin | 106 | LMT | F-35, missiles |
| General Dynamics | 86 | GD | Submarines, tanks |
| Northrop Grumman | 84 | NOC | B-21, space |
| BAE Systems | 65 | BA.L | UK defense |
| Thales | 56 | HO.PA | French defense |
| L3Harris | 52 | LHX | Communications |
| Leonardo | 28 | LDO.MI | Italian defense |
| Rheinmetall | 26 | RHM.DE | German defense |
| Leidos | 24 | LDOS | IT services |
| Booz Allen | 22 | BAH | Consulting |
| Textron | 18 | TXT | Aircraft, vehicles |
| Elbit Systems | 14 | ESLT | Israeli defense |
| CACI | 12 | CACI | IT services |
| Huntington Ingalls | 11 | HII | Shipbuilding |
| SAIC | 9.5 | SAIC | IT services |
| KBR | 9.2 | KBR | Engineering |

#### Private Companies (15 total)
| Company | Valuation ($B) | Notes |
|---------|---------------|-------|
| Anduril | 30.5 | Autonomous systems |
| Applied Intuition | 15 | Simulation software |
| Shield AI | 5 | AI pilots |
| Saronic | 4 | Autonomous vessels |
| Castelion | 2.5 | Defense manufacturing |
| Skydio | 2.2 | Military drones |
| Epirus | 1 | Directed energy |
| Vannevar Labs | 0.8 | Defense software |
| Hadrian | 0.45 | Factory automation |
| HawkEye360 | 0.4 | RF analytics |
| Rebellion Defense | 0.3 | AI software |
| CHAOS Industries | 0.22 | Ordnance |
| Primer | 0.18 | NLP for defense |
| Firestorm | 0.15 | Unmanned systems |
| Fortem | 0.12 | Counter-drone |

### 6.5 QUANTUM COMPUTING SECTOR
**File:** `lib/visualizations/quantum-bubble-chart.ts`

#### Public Companies (14 total)
| Company | Market Cap ($B) | Ticker | Notes |
|---------|----------------|--------|-------|
| Nvidia | 4,400 | NVDA | Quantum simulation |
| Microsoft | 3,900 | MSFT | Azure Quantum |
| Amazon | 2,500 | AMZN | Braket |
| Google | 2,500 | GOOGL | Sycamore processor |
| IBM | 236 | IBM | Quantum Network |
| Intel | 107 | INTC | Quantum research |
| Honeywell | 147 | HON | Trapped ion (Quantinuum) |
| Cisco | 235 | CSCO | Quantum networking |
| MicroChip | 48 | MCHP | Control systems |
| FormFactor | 8.2 | FORM | Cryogenic probing |
| IonQ | 6.4 | IONQ | Trapped ion quantum |
| D-Wave | 4.5 | QBTS | Quantum annealing |
| Rigetti | 3.5 | RGTI | Superconducting |
| Quantum Computing Inc | 0.8 | QUBT | Software/photonics |
| Arqit Quantum | 0.15 | ARQQ | Quantum encryption |

#### Private Companies (15 total)
| Company | Valuation ($B) | Notes |
|---------|---------------|-------|
| PsiQuantum | 6 | Photonic quantum |
| Atom Computing | 1.2 | Neutral atoms |
| QuEra | 1 | Neutral atoms |
| Xanadu | 1 | Photonic quantum |
| Infleqtion | 0.8 | Cold atom quantum |
| Oxford Quantum Circuits | 0.65 | Superconducting |
| Quantum Machines | 0.5 | Control systems |
| SandboxAQ | 0.5 | AI + quantum |
| Pasqal | 0.45 | Neutral atoms |
| Alice & Bob | 0.35 | Cat qubits |
| Universal Quantum | 0.3 | Trapped ion |
| Quantum Motion | 0.25 | Silicon quantum |
| Q-CTRL | 0.2 | Error correction |
| Classiq | 0.15 | Quantum software |
| Nord Quantique | 0.024 | Superconducting |

### 6.6 CYBERSECURITY SECTOR
**File:** `lib/visualizations/cybersecurity-bubble-chart.ts`

#### Public Companies (13 total)
| Company | Market Cap ($B) | Ticker | Notes |
|---------|----------------|--------|-------|
| Microsoft | 3,900 | MSFT | Security suite |
| Palo Alto Networks | 128 | PANW | Network security |
| CrowdStrike | 74 | CRWD | Endpoint security |
| Fortinet | 72 | FTNT | Network security |
| Cloudflare | 68 | NET | Web security |
| Datadog | 45 | DDOG | Security monitoring |
| Zscaler | 31 | ZS | Zero trust |
| CyberArk | 22 | CYBR | Privileged access |
| Check Point | 20 | CHKP | Network security |
| Gen Digital | 18 | GEN | Norton/Avast |
| Okta | 16 | OKTA | Identity |
| SentinelOne | 5.6 | S | Endpoint AI |
| Qualys | 4.8 | QLYS | Vulnerability mgmt |
| Tenable | 3.6 | TENB | Exposure mgmt |
| Rapid7 | 1.6 | RPD | Detection/response |

#### Private Companies (15 total)
| Company | Valuation ($B) | Notes |
|---------|---------------|-------|
| Tanium | 9 | Endpoint management |
| Snyk | 8.5 | Developer security |
| Netskope | 7.5 | SASE, filing IPO |
| 1Password | 6.8 | Password management |
| OneTrust | 5.3 | Privacy/compliance |
| Abnormal Security | 5.1 | Email security |
| Arctic Wolf | 4.3 | MDR/SOC |
| Cohesity | 3.7 | Data security |
| Illumio | 2.7 | Zero trust segmentation |
| SonicWall | 2.1 | Network security |
| Druva | 2 | Cloud data protection |
| Signifyd | 1.34 | E-commerce fraud |
| BioCatch | 1.3 | Behavioral biometrics |
| Island | 1.3 | Enterprise browser |
| Vectra AI | 1.2 | AI threat detection |

### 6.7 Summary Statistics
| Sector | Public Cos | Private Cos | Total Companies | Notes |
|--------|------------|-------------|-----------------|-------|
| AI | 18 | 20 | 38 | Largest sector by value |
| Space Tech | 15 | 13 | 28 | Mix of old/new space |
| Robotics | 16 | 10 | 26 | Industrial + humanoid |
| Defense | 17 | 15 | 32 | Traditional + modern |
| Quantum | 14 | 15 | 29 | Early stage market |
| Cybersecurity | 13 | 15 | 28 | Mature market |
| **TOTAL** | **93** | **88** | **181** | |

## 7. IDENTIFIED ISSUES REQUIRING VALIDATION

### 7.1 Cross-Sector Overlaps
Several companies appear in multiple sectors:
- **Tesla**: AI ($1,100B) and Robotics ($1,100B)
- **Microsoft**: AI ($3,900B), Quantum ($3,900B), Cybersecurity ($3,900B)
- **Google**: AI ($2,500B), Quantum ($2,500B)
- **Amazon**: AI ($2,500B), Quantum ($2,500B)
- **Nvidia**: AI ($4,400B), Quantum ($4,400B)
- **Honeywell**: Defense ($147B), Quantum ($147B)
- **Lockheed Martin**: Space ($106B), Defense ($106B)
- **General Dynamics**: Space ($86B), Defense ($86B)
- **Northrop Grumman**: Space ($84B), Defense ($84B)
- **Thales**: Space ($56B), Defense ($56B)
- **L3Harris**: Space ($52B), Defense ($52B)
- **Datadog**: AI ($45B), Cybersecurity ($45B)

**Action Required**: Determine allocation percentages for each sector

### 7.2 Private Company Valuation Concerns
Companies requiring immediate verification:
- **OpenAI at $500B**: Verify if this includes secondary market premium
- **Anthropic at $170B**: Confirm latest round
- **SpaceX at $400B**: Check latest tender offer
- **Databricks at $100B**: Verify current valuation
- **Blue Origin at $75B**: Confirm valuation date

### 7.3 Questionable Inclusions
- **CoreWeave** listed as public (should be private)
- **Firefly** listed as public (should be private)
- **Astroscale** listed as public (went public in 2024?)
- **Sarcos** listed as public (delisted?)

### 7.4 Notable Omissions
Potential missing companies by sector:
- **AI**: Adept, Character.AI, Jasper, Stability AI
- **Space**: Vast Space, Lynk Global
- **Robotics**: Wayve, Argo AI (shutdown?), Aurora (public now?)
- **Defense**: Hermeus, True Anomaly
- **Quantum**: Quantinuum (excluded due to Honeywell ownership)
- **Cybersecurity**: Wiz (acquired?), Lacework (acquired?)

## 8. RESEARCH TASKS

### 8.1 Immediate Actions
1. Verify all market caps as of August 29, 2025
2. Confirm private valuations with dates
3. Resolve public/private classification errors
4. Calculate sector allocation percentages
5. Add missing notable companies

### 8.2 Deep Dive Analysis
1. Revenue allocation for major tech conglomerates
2. Identify missing unicorns in each sector
3. Validate growth rate assumptions
4. Research sector TAM from multiple sources
5. Calculate weighted average CAGRs

### 8.3 Documentation Requirements
- Source every data point
- Note confidence levels (High/Medium/Low)
- Flag any assumptions made
- Document calculation methodology
- Keep audit trail of changes

## 9. DELIVERABLES

### 9.1 Required Outputs
1. **6 Sector CSV Files**: Complete company listings with valuations
2. **Allocation Analysis**: Spreadsheet showing revenue breakdown
3. **CAGR Research**: Document with sources and calculations
4. **Validation Report**: Summary of findings and recommendations
5. **Updated bubble chart code**: Corrected data

### 9.2 Timeline
- Phase 1 (Immediate): Data validation and CSV creation
- Phase 2 (Day 1): Market cap and valuation updates
- Phase 3 (Day 2): Revenue allocation analysis
- Phase 4 (Day 3): CAGR projections and research
- Phase 5 (Day 4): Final review and recommendations

## 10. RISK MITIGATION

### 10.1 Data Accuracy Risks
- **Mitigation**: Multiple source verification
- **Mitigation**: Date stamp all valuations
- **Mitigation**: Note confidence levels

### 10.2 Sector Definition Risks
- **Mitigation**: Clear inclusion criteria
- **Mitigation**: Document edge cases
- **Mitigation**: Peer review by experts

### 10.3 Projection Risks
- **Mitigation**: Conservative estimates
- **Mitigation**: Range-based projections
- **Mitigation**: Historical validation

---

**Document Status**: Active  
**Last Updated**: August 29, 2025  
**Next Review**: After validation completion  
**Owner**: EQUIAM Analytics Team