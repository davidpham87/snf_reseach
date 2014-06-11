shinyUI(fluidPage(
  tags$h2("Tracking the Swiss Post Docs"),  
  
  fluidRow(
    p("Check where the Swiss postdoc have been researching!")
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
           plotOutput("myChart", height = 720, width = 1200)
    )
  )
))