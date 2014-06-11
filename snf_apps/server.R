#source('global.R')

shinyServer(function(input, output) {
  # You can access the value of the widget with input$slider1, e.g.
  output$value <- renderPrint({ input$year })
  output$myChart <- renderPlot( {
    base_disc <- numeric(0)
    if (input$social.sci) base_disc <- 1
    if (input$base.sci) base_disc <- c(base_disc, 2)
    if (input$bio.med) base_disc <- c(base_disc, 3)
    if (length(base_disc) == 0) return()
  
    dat.l <- dat.lyb[J(base_disc, input$year), list(N = sum(N)), by='iso3']
      print(world_map_void + geom_map(data = dat.l, aes(fill = log(N)), map = world.ggmap))
  })
})