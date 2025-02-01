const promptTemplate = `
Evaluate the following issue extracted from a GitHub project and classify it according to the criteria below:

(i) **Refactoring**  
Refactoring code is the process of restructuring existing code without changing its behavior. The benefits of refactoring include  
improving code readability, reducing complexity, making the code easier to maintain, and allowing new features to be added more easily.  

(ii) **Regression Testing**  
Regression testing is a type of software testing that verifies whether software that was previously developed and tested still performs the  
same way after being modified or integrated with other software. The purpose of regression testing is to ensure that changes  
to the software have not introduced new faults.  

(iii) **Both**  
When the issue falls into both categories.  

(iv) **None**  
When the issue does not fit any of the above criteria. You may suggest an alternative classification.  

###Your response should be in this format:

(i) Refactoring or (ii) Regression Testing or (iii) Both or (iv) None

Text explaining your analysis


### Issue Details  
**Title:** {{title}}  
**Description:** {{description}}  

### Labels 
{{labels}}

### Comments  
{{comments}}
`;

export default promptTemplate;
