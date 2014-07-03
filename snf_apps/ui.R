shinyUI(fluidPage(
  tags$h2("Tracking the Swiss Post Docs"),  
  
  fluidRow(
    p("Check where the Swiss postdoc have been researching: 
        This representent where the Swiss junior researchers have been working for the past years"),
    p("The two *Rmd* files explaining the Data processing and the exploratory data analysis are published at the following links on Rpubs:"),
    a("Data Processing", href = "http://rpubs.com/davidpham87/19545"),  
    br(),
    a("Exploratory Data Analysis", href = "http://rpubs.com/davidpham87/19544"),
    br(), br(),
    div("If you want the d3.js version, please follow this link: "),
    a("http://davidpham87.github.io/snf_research/", href = "http://davidpham87.github.io/snf_research/"),
    br(),
    p("You just need to use press the play button to launch the animation or check the boxes to have subset the data.")
    ),
  
                                        # Copy the line below to make a slider bar
  fluidRow(
    column(6, 
           sliderInput("year", label = h3("Year"), min = 2008, max = 2014, 
                       value = 2008, format = '####', 
                       animate=animationOptions(interval=2000, loop=TRUE))
           ),
    column(6, 
           h3('Disciplin'),
           checkboxInput('social.sci', 'Social Sciences', T),
           checkboxInput('base.sci', 'Base Sciences', T),
           checkboxInput('bio.med', 'Biology/Med', T)
           )
    ),
  hr(), 
  fluidRow(
    column(width = 3,   verbatimTextOutput("value"))
    ),
  
  fluidRow(      
    column(width=12,
      tabsetPanel(
        tabPanel("World Map", 
                 plotOutput("myChart", height = 720, width = 1200)),
         tabPanel("Time Series",
                 plotOutput('myTs', height = 720, width = 1200))       
        )
      )
    )
  )
)        
