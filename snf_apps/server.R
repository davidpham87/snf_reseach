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

  output$myTs <- renderPlot({
    base_disc <- numeric(0)
    if (input$social.sci) base_disc <- 1
    if (input$base.sci) base_disc <- c(base_disc, 2)
    if (input$bio.med) base_disc <- c(base_disc, 3)
    if (length(base_disc) == 0) return()

    dat.l <- dat.lyb[J(base_disc), list(N = sum(N)), by='iso3,project_year']
    setkey(dat.l, iso3)
    dat.l <- dat.l[J(dat.l[, min(log(N+1)), by='iso3'][V1 > 1.5, iso3])]

    print(ggplot(dat.l, aes(project_year, log(N), color=iso3)) + geom_line())
  })
})
