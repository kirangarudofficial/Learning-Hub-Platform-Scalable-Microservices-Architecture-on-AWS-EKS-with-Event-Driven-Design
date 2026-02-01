# 📐 Architecture Diagrams
## Learning Hub Production Platform

This document contains the architecture diagrams for the Learning Hub platform, based on the `PRODUCTION_DEPLOYMENT_PLAN.md`.
These diagrams are written in **Mermaid**, which allows for version control, easy editing, and rendering in most modern Markdown viewers (GitHub, VS Code, etc.).

### 1. ☁️ Cloud Infrastructure (AWS Multi-AZ)
Representation of the VPC, Subnets, and Networking layer.

```mermaid
graph TB
    subgraph "AWS Cloud (us-east-1)"
        subgraph "VPC (10.0.0.0/16)"
            subgraph "Public Subnets (Layer 1)"
                ALB[Application Load Balancer]
                NAT[NAT Gateways x3]
                IGW[Internet Gateway]
            end

            subgraph "Private App Subnets (Layer 2)"
                EKS_CP[EKS Control Plane]
                Lambda[Lambda Functions]
                NG_APP[Node Group 1: Application]
                NG_OPS[Node Group 2: Platform Ops]
            end

            subgraph "Private Data Subnets (Layer 3)"
                NG_DATA[Node Group 3: Data (Stateful)]
                EBS[EBS Volumes]
            end
        end
        
        Internet((Internet)) --> IGW
        IGW --> ALB
        ALB --> NG_APP
        NG_APP --> NG_DATA
        NG_OPS --> NG_APP
        NG_APP --> NAT
        NAT --> IGW
    end
    
    style ALB fill:#FF9900,stroke:#232F3E
    style EKS_CP fill:#FF9900,stroke:#232F3E
    style Lambda fill:#FF9900,stroke:#232F3E
    style NG_DATA fill:#3F8624,stroke:#232F3E
```

### 2. ☸️ Kubernetes Cluster Architecture
Detailed view of Node Groups, Namespaces, and Workload distribution.

```mermaid
graph TB
    subgraph "EKS Cluster"
        subgraph "Node Group 1: Application (Stateless)"
            NS_FE[Namespace: frontend]
            NS_CORE[Namespace: learning-core]
            NS_MEDIA[Namespace: media-ai]
            NS_COMMS[Namespace: communication-engagement]
            NS_BILL[Namespace: commerce-billing]
            NS_MKT[Namespace: growth-marketing]
            NS_INT[Namespace: data-intelligence]
        end

        subgraph "Node Group 2: Platform (Ops)"
            NS_OPS[Namespace: platform-ops]
            NS_MON[Namespace: monitoring]
            Jenkins[Jenkins Master/Agent]
            ArgoCD[ArgoCD Controller]
            Prom[Prometheus/Grafana]
        end

        subgraph "Node Group 3: Data (Stateful)"
            NS_DATA[Namespace: data-platform]
            Postgres[(PostgreSQL)]
            Mongo[(MongoDB)]
            Redis[(Redis)]
        end
    end

    NS_FE --> NS_CORE
    NS_CORE --> Postgres
    NS_MEDIA --> Mongo
    ArgoCD -.-> NS_FE
    ArgoCD -.-> NS_CORE
    ArgoCD -.-> NS_DATA
    Prom -.-> NS_FE

    style NS_DATA fill:#E6F3FF,stroke:#0073BB
    style Postgres fill:#336791,color:white
    style Mongo fill:#47A248,color:white
    style Redis fill:#D82C20,color:white
```

### 3. 🎥 Video Processing Pipeline
Hybrid Serverless + EKS workflow for media handling.

```mermaid
sequenceDiagram
    participant User
    participant FE as Frontend
    participant API as Video Service
    participant S3_UP as S3 (Upload)
    participant EB as EventBridge
    participant Lambda as Lambda Orchestrator
    participant FFmpeg as Lambda Transcoder
    participant S3_ST as S3 (Stream)
    participant DDB as DynamoDB
    participant CF as CloudFront

    User->>FE: Upload Request
    FE->>API: Get Presigned URL
    API-->>FE: URL Returned
    FE->>S3_UP: Upload Video File
    S3_UP->>EB: ObjectCreated Event
    EB->>Lambda: Trigger Validation
    Lambda->>FFmpeg: Start Transcoding
    FFmpeg->>S3_ST: Save HLS Segments
    FFmpeg->>DDB: Update Status (READY)
    User->>FE: Request Playback
    FE->>API: Get Signed Cookie
    API-->>FE: CloudFront Token
    FE->>CF: Stream Video (HLS)
    CF->>S3_ST: Fetch Segments
    CF-->>User: Video Stream
```

### 4. ⚙️ CI/CD Pipeline (Jenkins + ArgoCD)
Separation of Continuous Integration and Continuous Deployment.

```mermaid
flowchart LR
    subgraph "CI: Jenkins (Shared Library)"
        Code[Checkout Code] --> Test[Unit Tests & Lint]
        Test --> Sec[Security Scan (Trivy/OWASP)]
        Sec --> Build[Docker Build]
        Build --> Push[Push to ECR]
        Push --> Update[Update GitOps Repo (Tags)]
    end

    subgraph "CD: ArgoCD (GitOps)"
        GitOps[GitOps Repo] --> Sync[ArgoCD Sync]
        Sync --> Apply[Apply Manifests]
        Apply --> EKS[EKS Cluster]
    end

    Update -.-> GitOps
    
    style CI fill:#D4EBF2
    style CD fill:#F2D4D4
    style Code fill:#FFFFFF
    style EKS fill:#326CE5,color:white
```

### 5. 🗄️ Detailed Database Architecture
Containerized StatefulSets on dedicated nodes.

```mermaid
graph TD
    subgraph "Node Group 3: Data"
        subgraph "PostgreSQL Cluster"
            PG_Primary[(Primary)]
            PG_Replica1[(Replica 1)]
            PG_Replica2[(Replica 2)]
        end
        
        subgraph "MongoDB Replica Set"
            Mongo_P[(Primary)]
            Mongo_S1[(Secondary)]
            Mongo_S2[(Secondary)]
        end
        
        subgraph "Redis"
            Redis_M[(Master)]
            Redis_R[(Replica)]
        end
        
        PVC[Persistent Volume Claims] --> EBS[EBS gp3 Volumes]
        EBS --- PG_Primary
        EBS --- Mongo_P
    end

    App[Application Services] -->|Write| PG_Primary
    App -->|Read| PG_Replica1
    App -->|Read/Write| Mongo_P
    App -->|Cache| Redis_M
```
