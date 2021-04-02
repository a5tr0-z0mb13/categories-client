# CategoriesClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.1.

## Background

Technical test, set as part of the application process for a software engineering consultancy. Comes in two parts: CategoriesClient (this) and [CategoriesServer](https://github.com/a5tr0-z0mb13/categories-server) - A [NestJS](https://nestjs.com/) application. The test was timeboxed to four hours.

## Requirements

Create an application which will allow at least two users to log in simultaneously and manage items in categories. The categories should be in a hierarchy of potentially infinite depth. The items only require a label. The users should be able to perform standard CRUD, plus if one user makes a change, the other user(s) should see the change (if appropriate) without manually refreshing their web browser. Your solution should follow best practice, and be robust and scalable. We expect to see the same techniques and approaches that you would use in a real project.

## User Journeys

Mark wants to keep track of his belongings. He logs in, and is presented with a list of categories, showing the different levels visually. He adds “Electronics”, and under that, “Televisions”. To this category he adds the items “49-inch LCD”, “40-inch plasma”, and “32-inch CRT”. Sandy logs in and creates “Gaming consoles”, and under this, the items “PS4 Pro”, “XBox One X”, and “Nintendo Switch”. Mark sees Sandy’s entries appear. He edits “Gaming consoles” to sit under “Electronics”. This change appears on Sandy’s screen as soon as he has done it.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
