# Business Case: Implementing an Internal RAG Chatbot for Employee Support

## **Executive Summary**

The R&D and development team is overwhelmed with support requests from over 3,500 employees, primarily related to software, automation tools, and processes. Despite extensive documentation, employees seldom refer to it before seeking assistance, consuming significant team resources.

The proposed solution is to implement a Retrieval-Augmented Generation (RAG) chatbot integrated into our existing automation platform. This chatbot will leverage our documentation and context to efficiently assist employees. Three potential options are evaluated:

1. **Moov.ai**: A local vendor offering partial or full development services.
2. **Uzinakod**: Another local vendor with a similar offering but preferring the Azure-only stack.
3. **Internal Development**: Building the chatbot in-house, led by the team familiar with our stack and platform.

### Recommendation

The preferred solution is **Internal Development**, as it offers better control, lower cost, faster delivery, and flexibility compared to vendor options.

---

## **Business Need**

### **Background**

The R&D team built an automation platform aggregating tools, tutorials, and documentation for internal use. However, employee reliance on direct support persists, hindering productivity. A RAG chatbot can alleviate this by providing instant, accurate answers and reducing the support burden.

### **Objectives**

- Implement a chatbot to assist employees with minimal manual intervention.
- Integrate the chatbot seamlessly into the existing platform and stack.
- Ensure scalability and maintainability for long-term use.

---

## **Evaluation Criteria**

The following criteria were used to evaluate the three options:

- **Cost**: Budget implications for MVP and production-ready solutions.
- **Timeline**: Time to deliver a functional MVP and full production-ready solution.
- **Integration**: Compatibility with the existing stack (Django API, Next.js, Postgres, Azure).
- **Flexibility**: Ability to refine, update, and maintain the chatbot post-launch.
- **Performance**: Access to cutting-edge LLM models and tools (e.g., OpenAI, Gemini).
- **Risk**: Potential challenges in implementation and vendor dependencies.

---

## **Options Overview**

### **Option 1: Moov.ai**

- **Description**: A local vendor offering RAG chatbot implementation.
- **Strengths**: Familiarity with the stack; option to handle backend work; a team of several experts.
- **Weaknesses**: High cost; reliance on vendor for key elements; resources not fully dedicated (likely 50% allocation).

### **Option 2: Uzinakod**

- **Description**: Another local vendor with RAG chatbot expertise.
- **Strengths**: Cost-effective MVP estimate; prior experience with chatbots.
- **Weaknesses**: Preference for Azure-only stack; limited team (2 developers, not fully allocated); potential delays due to availability constraints.

### **Option 3: Internal Development**

- **Description**: In-house development led by the existing team.
- **Strengths**: Full control; lower cost; faster delivery; familiarity with stack.
- **Weaknesses**: Requires dedicated internal resources.

---

## **Detailed Comparison**

| **Criteria**          | **Moov.ai**               | **Uzinakod**             | **Internal Development**   |
|------------------------|---------------------------|---------------------------|-----------------------------|
| **Cost**              | 149,600 CAD for full project | 45k–55k CAD for MVP; ~30–50% extra for full project | ~5k CAD for MVP (120 hours @ 30 CAD/hour); <15k CAD total |
| **Timeline**          | 4–5 months for full project; shared resources may cause delays | 30–45 business days for MVP; undefined for full project | 2–3 weeks for MVP (full-time); longer if concurrent tasks |
| **Integration**       | Moderate; reliant on Azure stack | Challenging; strong reliance on Azure-only stack | Seamless; team fully familiar with stack |
| **Flexibility**       | Moderate; collaborative approach but vendor-dependent | Low; vendor-dependent with resource uncertainty | High; fully customizable and flexible internally |
| **Performance**       | Supports modern AI models but reliant on Azure services | Limited by Azure stack and models | Full access to preferred LLMs and modern tools |
| **Risk**              | Medium; high cost and dependency on vendor timelines | High; potential delays due to limited resources | Low; internally controlled timelines and deliverables |
| **Responsiveness**    | Delivered proposal in time but last-minute effort raises concerns | Delayed responses, proposal unavailable before decision | Immediate access to results and adjustments by the internal team |
| **Tools/Resources**   | Agile, SCRUM-based with external experts (50% allocated) | Agile; reliance on 2 vendor developers (part-time) | Scrum sprints, leverages GitHub Copilot, Workspace for AI-assisted development |

---

## **Technical Analysis**

### **Preferred Tech Stack**

- **Moov.ai**: Prefers Azure but adheres to existing stack with support for modern tools.
- **Uzinakod**: Prefers Azure-only, potentially limiting LLM capabilities.
- **Internal Development**: Uses Vercel AI SDK, LangChain, LlamaIndex, OpenAI API, and Postgres with vector extension for seamless integration and flexibility.

### **Integration**

- **Moov.ai**: Requires access to and modification of our codebase.
- **Uzinakod**: High risk of IT challenges with Azure-only stack.
- **Internal Development**: Fully aligned with current architecture, ensuring smooth deployment.

### Leveraging AI for Internal Development

An additional advantage of pursuing internal development is our ability to leverage AI tools to streamline and accelerate the process. Specifically, we can utilize **GitHub Copilot** as a development assistant directly within VS Code, enabling rapid code generation, error handling, and implementation of complex logic. This tool can significantly enhance developer productivity by providing contextual suggestions, improving code quality, and reducing manual effort.

These features allow us to accelerate MVP delivery while maintaining flexibility and control over the development process. The use of AI-powered tools also reduces overall costs and time compared to external vendor development, which lacks these optimized AI integrations tailored to our needs.

---

## **Budget and Financial Analysis**

### **Costs**

- **Moov.ai**: ~150k CAD for full implementation.
- **Uzinakod**: ~90k CAD total (MVP + refinements).
- **Internal Development**: <15k CAD (team cost only).

### **Ongoing Costs**

- Uniform across options: API costs (OpenAI, etc.) assumed by the organization.

### **Return on Investment (ROI)**

Internal development offers the highest ROI by minimizing upfront costs and ensuring long-term maintainability without vendor lock-in.

---

## **Timeline and Project Schedule**

### **Moov.ai**

- MVP: 2.5 months
- Full Project: 4–5 months

### **Uzinakod**

- MVP: 30–45 business days
- Full Project: Undefined; likely to extend beyond MVP due to resource constraints.

### **Internal Development**

- MVP: 2–3 weeks
- Full Project: Iterative updates post-MVP, leveraging the team's availability.

---

## **Risk Assessment**

| **Risk**            | **Moov.ai**                      | **Uzinakod**                         | **Internal Development**     |
| ------------------- | -------------------------------- | ------------------------------------ | ---------------------------- |
| **IT Challenges**   | Medium; external vendor access   | High; Azure-only stack issues        | Low; internal team alignment |
| **Timeline Delays** | High; vendor resource dependency | High; limited developer availability | Low; controlled internally   |
| **Flexibility**     | Low; vendor-dependent            | Low; vendor-dependent                | High; fully customizable     |

---
---

## **Vendor Responsiveness and Timeline Considerations**

The responsiveness of both vendors during the initial engagement phase has provided insights into their potential reliability as partners:

- **Moov.ai**: Although they initially provided a rough estimate, their last-minute email offering to send the detailed estimation just hours before the business case presentation raises concerns about their proactiveness and preparedness. Furthermore, their resources are shared across multiple projects, with approximately 50% allocation to this project.
- **Uzinakod**: Their inability to deliver even a rough estimation until January due to bandwidth constraints suggests challenges in prioritization and resource allocation. With only two developers assigned part-time, resource availability is a significant risk.

Additionally, while the proposed 2-3 weeks MVP timeline for internal development assumes full-time dedication, handling other tasks in parallel could extend this timeline. However, even in such a scenario, the timeline would likely remain significantly shorter than the delivery schedules proposed by external vendors. This flexibility allows for better alignment with ongoing projects without compromising overall progress.

These responsiveness issues highlight the risks associated with relying on external vendors, particularly when internal support or rapid iteration is required. Building the chatbot internally ensures that we maintain full control over timelines and deliverables, reducing dependency on external parties with unpredictable availability.

---

## **Recommendation**

### **Preferred Option**: Internal Development

- **Justification**:
  - Lowest cost (<12k CAD vs. 90–400k CAD).
  - Fastest MVP delivery (2–3 weeks vs. months).
  - Full control over development and refinement.
  - Seamless integration into the existing stack.
  - Higher ROI and maintainability without vendor dependencies.

### **Next Steps**

1. Dedicate internal resources for full-time development starting January 2025.
2. Leverage Vercel AI SDK, LangChain, LlamaIndex, and OpenAI for RAG chatbot implementation.
3. Build and test an MVP within 2–3 weeks.
4. Iterate based on feedback to refine and extend the chatbot for production readiness.

---

## **Appendices**

### **Supporting Details**

- Vendor proposals (pending).
- Estimated development hours and costs.
- Technical stack documentation.




60 /h 

etienne 15% a 100/h
simon 50/h
estimation avec personnes add 

add steps future dev and future of AI 
advantages of internal dev: quick win, demonstrate usage, etc..

envoyer meeting tracking djangomatic