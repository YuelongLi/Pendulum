# Pendulum Project
07/29/2022

The active development of Pendulum had been migrated to Pendulum-beta, this repository is purely informational

## Github
In order to achieve structural development and version control that would allow more efficient and convenient purpose-driven deployment, the GitHub repository of the pendulum project is currently divided into several development branches: document, web grapher, and program-side-visualization, and several primary module branches: canvas, UI, and computation module. The code on GitHub for this project is now  open-sourced, so that everyone can have access to the development of Pendulum. The service of this software is also going to be projected to be free consequently, and every stable build in the master branch will be hosted on the Cloudnest website. 
## Development Workflow
The general workflow of the project entails: recognizing the need for a functionality/error in one of the development branches, put it on an agenda queue; for each functionality/error that come up in the agenda, develop the corresponding module branch and potentially its submodule branch until it has been completed and become sufficiently self-contained, then merge upward into the working tree until it has resolved the request of functionality, concluding the development cycle. Ideally at the end of each cycle a retrospective will be performed to propagate continued improvements. In this way the most amount of compatibility issues will be avoided. For additional information on the development cycle, please check this guide.
### Document
The document branch focuses on the development of Pendulum document. It may be migrated into its own repository in the future. It is projected to build interfaces to integrate various modules of Pendulum into Jupyter notebook as widgets. The document branch is projected to make use of the Canvas module and the UI module.
### Program Side
Program side faces users that run computations JavaScript and wish to visualize results through the web browser. The program side visualization branch focuses on developing data structures that synchronize the canvas and UI module, interfaces that provide quick access to the canvas module, and building frameworks in html for interactive visualization and data analysis. Program side builds various tool kits that makes web-based visualization of mathematical concepts or physical simulations easy, and it is also projected to integrate in api-modules that will allow various data collection process.
### Web Grapher
Web grapher focuses on developing the web-based software that enables constructions of physical and mathematical simulations/representations through mathematical expressions. It is the continuation of the original Pendulum grapher, with improvements on its asynchronous computations and mathematical data structure. The grapher will utilize the canvas module, the UI module, and the computation module, incorporating additional widgets from the UI module and changing synchronous commands issued from the central console to asynchronous ones.
## Modularization
One primary principle of this round of development is the modularization of the Pendulum project. Its ultimate goal is no longer just to build a single software that integrates graphics rendering, canvas display of mathematical entities, mathquill input and parsing, user interactions, but instead to make each of these field powerful, functional and self-contained modules, allowing developers to combine them in any way and even make them into widgets for other apps. Currently each module and their submodules are kept in github as separate branches, which may in the future become kept in their own repositories once I open an account solely for the purpose of the Pendulum project.
### Canvas Module
Canvas module will create an object-based interface that wraps around the threejs library. It’ll provide various interfaces for user interaction such as zooming or pinning, as well as a systematic approach to mathematical visualization including components such as coordinate transformers (locator), coordinate system display and labeling, etc. Graphing quality and efficiency will also be further improved, including addition of algorithms for dynamic meshing in 2D and 3D and graph animations. Graphics updates and rendering will now synchronously along other computations.
### UI Module
UI module serves to create interfaces for the user to interact with the data and computations. This includes equation fields, object fields, siders, color pickers, etc.
### Computation Module
Computation module hosts all the backend computations ranging from dependency building and integration. The module should use dynamic programming. The Pendulum computation is a dependency aware system, unlike conventional programming and variable declaration.
## Building and management
### NPM 
The project uses npm to manage is packages to easily keep its dependencies up to date. The dependencies within javascript are defined using commonJs style imports. The resultant javascript that gets used is built by browserify.
### Build tools
Grunt is used for the building of the entire project, which includes relevant css and javascript files. In particular, the browserify module is used for compiling javascript, while browserify-css is used for compiling css from various sources.
### Managing work tree
One primary question is whether the project should be hosted by an isolated user called Pendulum? And the other is whether the project should have separate repositories for its different features. One way of managing codes is simply use the current Pendulum folder and keep developing under the current worktree tree. But the flaw is obvious, the current work tree is slightly contaminated and modularization of each distinct features will be difficult in the future. However, referencing to the workflow of Mathquill and Jupyter, it seems reasonable to separate distinct features by branches and create merges as progresses ensue. 
## Implementation
### Program structure
https://drive.google.com/file/d/1gnjmQY8rVansunjxVkMmdSUQfv_gHPMu/view?usp=sharing
### Workflow
It is recommended to first draw the program structure of a module with a UML diagram and then to create all the classes, interfaces, fields without functional behaviors but only the inheritance structure from bottom to top. After that, go from top to bottom to implement all the methods. 
