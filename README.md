# Weather App

    this app will show the weather by request of a specific location (defaulting to New York), using the OpenWeatherMap API.

    This project will showcase the use of managing APIs, using promises, a bundler (webpack), transpiler (babel) and more.

    --- Thought Process ---

    # The Problem
    Take user input for location and show him the relevant details with a pleasant UI/UX.

     This one is quite simple, All we need to do is to make a fetch to our API with the wanted location (provided by the user) to get a JSON with all the data we want.
    Once we have the data we takes the pieces we want (make sure they are available and loaded) and spread them accordantly.

    # Plan
    API handle module will take the request and handle the pieces from the API into simple understandable variables.
    It will have takeLocationInput that takes a new location and start the process of breaking down the JSON. At the end it will fire the UI.

    UI module will have two sections. One section for the element that don't rely on the API (can even make placeholder elements).
    Second section for handling the APIs UI.

    # Little UI template
    HEADER
        - logo, c/f, search, social
    MAIN
        TODAY
            -relevant weather logo (clouds, sun, rain etc), Temperature over-lapping, BIG CITY NAME (dynamic correlated to word's length).
            -feels like temp, rain change, wind direction, wind speed, humidity ... etc.
        WEEK
            -small boxes of the next 7 days
                -small correlated weather logo, temp, day (outside the box)
            -box clicked
                scrolled down to view the clicked day as the current day

    This is a rough sketch of how i imagine how it will look, might change.



    # That's it
    For the thought process at least, the rest of the work is coding.
    Thank you for viewing this project, I hope it helped you in some way.
