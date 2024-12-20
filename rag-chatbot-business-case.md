# Business Case: Implementing an Internal RAG Chatbot for Employee Support

## **Executive Summary**

The R&D and development team is overwhelmed with support requests from over 3,500 employees, primarily related to software, automation tools, and processes. Despite extensive documentation, employees seldom refer to it before seeking assistance, consuming significant team resources.

The proposed solution is to implement a Retrieval-Augmented Generation (RAG) chatbot integrated into our existing automation platform. This chatbot will leverage our documentation and context to efficiently assist employees. Three potential options are evaluated:

1. **Moov.ai**: A local vendor offering partial or full development services.
2. **Uzinakod**: Another local vendor with a similar offering but preferring the Azure-only stack.
3. **Internal Development**: Building the chatbot in-house, led by the team familiar with our stack and platform.

### Recommendation

The preferred solution is **Internal Development**, as it offers better control, lower cost, faster delivery, and flexibility compared to vendor options. Additionally, it allows us to deliver a **"quick win"** for the company by demonstrating the benefits of AI solutions and showcasing ROI to advocate for larger AI initiatives.

---

## **Business Need**

### **Background**

The R&D team built an automation platform aggregating tools, tutorials, and documentation for internal use. However, employee reliance on direct support persists, hindering productivity. A RAG chatbot can alleviate this by providing instant, accurate answers and reducing the support burden.

### **Objectives**

- Implement a chatbot to assist employees with minimal manual intervention.
- Integrate the chatbot seamlessly into the existing platform and stack.
- Ensure scalability and maintainability for long-term use.
- Demonstrate the potential of AI solutions within the company to support future AI-driven initiatives.

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
- **Strengths**: Full control; lower cost; faster delivery; familiarity with stack; opportunity to train and mentor junior developers.
- **Weaknesses**: Requires allocation of internal resources and collaboration across roles.

---

## **Detailed Comparison**

| **Criteria**          | **Moov.ai**               | **Uzinakod**             | **Internal Development**   |
|------------------------|---------------------------|---------------------------|-----------------------------|
| **Cost**              | 149,600 CAD for production-ready prototype | 45k–55k CAD for MVP; ~30–50% extra for full project | ~18.2k CAD for MVP (4–5 weeks @ ~60% allocation and additional team members) |
| **Timeline**          | 4–5 months for full project; shared resources may cause delays | 30–45 business days for MVP; undefined for full project | 4–5 weeks for MVP due to part-time allocation |
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

- **Moov.ai**: Requires access to and modification of our codebase, and IT challenges for external access. 
- **Uzinakod**: Requires access to and modification of our codebase, and IT challenges for external access. 
- **Internal Development**: Fully aligned with current architecture, ensuring smooth deployment.

### Leveraging AI for Internal Development

An additional advantage of pursuing internal development is our ability to leverage AI tools to streamline and accelerate the process. Specifically, we can utilize **GitHub Copilot** as a development assistant directly within VS Code, enabling rapid code generation, error handling, and implementation of complex logic. This tool can significantly enhance developer productivity by providing contextual suggestions, improving code quality, and reducing manual effort.

These features allow us to accelerate MVP delivery while maintaining flexibility and control over the development process. The use of AI-powered tools also reduces overall costs and time compared to external vendor development.

---

## **Why Azure-Only Stack Is a Red Flag**

### **IT Access and Permissions**
Relying strictly on Azure-managed services could pose significant challenges due to potential delays or roadblocks in gaining access to required resources through IT. Historically, our IT team has been slow to provision non-standard resources, creating risks for timely delivery.

### **Technology and Model Limitations**
Azure's stack lacks the latest LLM models (e.g., OpenAI o1, Gemini) and advanced capabilities. These models offer better performance, improved precision, and reduced hallucination rates. They also provide larger context windows, allowing for richer prompts and responses, enhancing the chatbot’s effectiveness.

### **Security and Privacy**
Even with OpenAI or Vercel SDK integration, our solution remains secure and private within our existing stack on Azure. Our data is handled within Docker containers, Azure Container Registry, and Postgres, fully compliant with internal VPS security protocols. Thus, concerns about security and data privacy are not exclusive to Azure-only solutions.

---

## **Vendor Responsiveness and Timeline Considerations**

### **Vendor Responsiveness Insights**

The responsiveness of both vendors during the initial engagement phase has provided insights into their potential reliability as partners:

- **Moov.ai**: Although they initially provided a rough estimate, their last-minute email offering to send the detailed estimation just hours before the business case presentation raises concerns about their proactiveness and preparedness. Furthermore, their resources are shared across multiple projects, with approximately 50% allocation to this project.
- **Uzinakod**: Their inability to deliver even a rough estimation until January due to bandwidth constraints suggests challenges in prioritization and resource allocation. With only two developers assigned part-time, resource availability is a significant risk.

### **Risks of Relying on External Vendors**

These responsiveness issues highlight the risks associated with relying on external vendors, particularly when internal support or rapid iteration is required. Building the chatbot internally ensures that we maintain full control over timelines and deliverables, reducing dependency on external parties with unpredictable availability. 

### **Impact of Exploration Phases**

According to Moov.ai’s proposal—and extrapolating a similar pattern with Uzinakod—the first three steps of their process are dedicated to exploring our stack, codebase, and requirements in detail. This initial phase would take approximately three weeks minimum, during which little to no tangible progress toward delivering an MVP would be made. 

### **The Importance of a "Quick Win"**

For a project aimed at delivering a **"quick win"** and demonstrating the value of AI solutions, this exploratory phase is counterproductive. By handling the development internally, we can bypass this ramp-up period entirely due to our existing familiarity with the stack, codebase, and requirements, allowing us to deliver a working solution faster and more efficiently.

---

## **Recommendation**

### **Preferred Option**: Internal Development

- **Justification**:
  - Cost-effective (~18.2k CAD compared to 90–150k CAD).
  - Faster MVP delivery (4–5 weeks vs. months).
  - Direct familiarity with the stack, avoiding onboarding delays with vendors.
  - Opportunity to train and upskill junior developers, ensuring maintainability.
  - Flexibility for iterative improvements based on real-time feedback.
  - Positions the R&D team to score a "quick win," demonstrating AI's potential within the company.
  - Advocates for future expansion phases to improve the chatbot with additional features such as **agents** and **chains** (used for RAG), enabling advanced automation and more complex workflows.
  - Supports the integration of AI/ML capabilities into automation tools, yielding better results, saving time, and reducing costs through non-deterministic, adaptive solutions.

### **Next Steps**

1. Allocate 60% of developer time and necessary support roles to the project starting January 2025.
2. Build and test an MVP in 4–5 weeks using Vercel AI SDK, LangChain, and OpenAI.
3. Train junior developer for future maintenance.
4. Iterate and refine the chatbot based on live testing and feedback.


## **Return on Investment (ROI)**

Implementing the chatbot through internal development offers significant ROI both in the short term and long term:

### **Short-Term Benefits**
1. **Cost Savings**: 
   - The estimated cost of internal development (~18.2k CAD) is substantially lower than vendor solutions, which range from 45k CAD (MVP) to 150k CAD or more (production-ready prototype).
   - Avoidance of vendor onboarding costs and delays, which can result in additional expenses and lost productivity.

2. **Faster Time to Value**:
   - With an internal approach, the MVP can be delivered in just 4–5 weeks, compared to months with external vendors. 
   - Employees will gain access to the chatbot sooner, reducing the support burden and increasing operational efficiency.

3. **Improved Efficiency**:
   - The chatbot will handle a significant portion of repetitive support tasks, allowing the R&D team to focus on higher-value projects.

### **Long-Term Benefits**
1. **Scalability**:
   - By building in-house, the team gains direct control over the codebase, ensuring scalability and adaptability for future requirements without reliance on external vendors.

2. **Capability Expansion**:
   - Future phases can enhance the chatbot with **agents** and **chains**, enabling automation of more complex workflows.
   - Integration of AI/ML capabilities into automation tools will further reduce time and costs across the organization.

3. **Team Skill Development**:
   - Junior developers involved in the project will acquire valuable AI/ML skills, reducing future hiring needs and strengthening internal expertise.

4. **Advocacy for AI Adoption**:
   - A successful internal project will demonstrate the value of AI solutions, making a strong case for increased budget allocation to further AI-driven initiatives.

### **Quantifying ROI**

Using conservative estimates:
- If the chatbot reduces support workload by just **20%**, the equivalent productivity savings across 3,500 employees could result in tens of thousands of CAD in annual savings.  

  **Example 1** (3,500 employees):
  - Weekly time saved per employee: 10 minutes
  - Average salary: 50 CAD/hour
  - Annual hours saved: 10 minutes * 3,500 employees * 52 weeks / 60 = 30,333 hours
  - Annual cost savings: 30,333 hours * 50 CAD/hour = 1.52 million CAD

  **Example 2** (100 support employees):
  - Weekly time saved per employee: 10 minutes
  - Average salary: 50 CAD/hour
  - Annual hours saved: 10 minutes * 100 employees * 52 weeks / 60 = 867 hours
  - Annual cost savings: 867 hours * 50 CAD/hour = 43,350 CAD

- Future automation and expansion phases could generate even greater savings by addressing inefficiencies in existing workflows.
- Long-term cost avoidance (e.g., avoiding reliance on vendors for updates or new features) further amplifies ROI.  

Additionally, internal development avoids potential cost overruns commonly associated with external vendors, particularly in scenarios involving unexpected delays, scope changes, or increased resource requirements.

In summary, the internal development approach not only delivers immediate cost and time advantages but also positions the organization to reap exponential benefits from future AI and automation capabilities.

---
---
# Appendices

## **What Are Chains and Agents?**

### **Chains**

Chains are sequences of modular AI tasks or operations that work together to achieve a specific goal. They allow developers to combine different AI capabilities (e.g., text generation, summarization, data extraction) into a cohesive workflow. Each step in a chain builds on the previous one, creating a seamless and automated process.

#### **Advantages of Chains**
- **Reusability**: Individual components of a chain can be reused in multiple workflows, saving time and effort.
- **Flexibility**: Chains can be customized to meet specific needs, adapting to different business processes.
- **Scalability**: Easily expandable by adding new modules to support additional functionalities.

#### **Example of a Chain**
1. **Input**: Employee submits a natural language question.
2. **Step 1**: Text is analyzed for intent (e.g., troubleshooting vs. informational query).
3. **Step 2**: Relevant documentation is retrieved from the database.
4. **Step 3**: Answer is generated and refined based on retrieved content.
5. **Output**: A precise, contextually accurate response is returned to the user.

---

### **Agents**

Agents are AI systems designed to perform specific tasks autonomously, often using decision-making logic. They act as intermediaries, interacting with APIs, databases, or even other AI models to complete complex operations.

#### **Advantages of Agents**
- **Autonomy**: Reduces manual intervention by handling tasks independently.
- **Multi-Step Execution**: Capable of performing multiple actions, such as gathering data, processing it, and delivering actionable insights.
- **Integration**: Easily connects with existing systems, enabling seamless workflows.

#### **Example of an Agent**
- **Scenario**: Employee wants to automate reporting.
- **Agent Workflow**:
  1. Retrieves the latest data from the database.
  2. Summarizes key insights using an AI model.
  3. Formats the data into a presentation-ready PDF.
  4. Emails the report to the relevant stakeholders automatically.


## **Internal Development Cost Breakdown**

### **Assumptions**
- Project duration: **4–5 weeks** (average of 4.5 weeks).
- Work hours per week: **40 hours**.
- Allocation:
  - Lead developer: 60% of the time, at **60 CAD/hour**.
  - Two junior developers: 15% of the time each, at **60 CAD/hour**.
  - Manager: 15% of the time, at **100 CAD/hour**.
  - Test user: 15% of the time, at **50 CAD/hour**.

### **Calculation**
1. **Lead Developer Cost**:
  - Hours: 4.5 weeks * 40 hours/week * 60% = 108 hours
  - Cost: 108 hours * 60 CAD/hour = 6,480 CAD

2. **Junior Developers Cost** (2 developers at 15% each):
  - Hours: 4.5 weeks * 40 hours/week * 15% = 27 hours
  - Cost: 27 hours * 60 CAD/hour = 1,620 CAD
  - Total for 2 devs: 1,620 CAD * 2 = 3,240 CAD

3. **Manager Cost**:
  - Hours: 4.5 weeks * 40 hours/week * 15% = 27 hours
  - Cost: 27 hours * 100 CAD/hour = 2,700 CAD

4. **Test User Cost**:
  - Hours: 4.5 weeks * 40 hours/week * 15% = 27 hours
  - Cost: 27 hours * 50 CAD/hour = 1,350 CAD

#### **Total Cost**
- Lead Developer: **6,480 CAD**
- Junior Developers: **3,240 CAD**
- Manager: **2,700 CAD**
- Test User: **1,350 CAD**
- **Grand Total**: 6,480 + 3,240 + 2,700 + 1,350 = 13,770 CAD

To account for **unforeseen overhead** (e.g., additional meetings or refinements), we apply a 25% buffer:
- **Final Estimated Cost**: 13,770 * 1.25 = 18,212.50 CAD

**Rounded Total**: **~18.2k CAD**