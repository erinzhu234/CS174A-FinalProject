# CS 174A Group 11 Final Project

UCLA CS174A Spring 2022 

Group 11

Erin Zhu, Kandrex Millones, Rahul Madnawat

Our project is BruinKart, inspired by Mario Kart. 
The car collect prizes and avoiding bumping into obstacles to deliver food across campus.

## How to start

To start the game, run the host.bat / host.command in the folder. 

## What to expect

### Game Logic
 - To successfully deliver the food, avoid all the obstacles (buildings) and collect prizes to earn score! 
 - You can only move within the track. 
 - If you managed to avoid all the obstacles and passes the endline, you successfully delivered your food! 
 - Your score and best score will be displayed.
 - Otherwise, if you bumped into a building, you failed to deliver your food, and your score will be displayed.
 - You are using car view, it will switch back to world view to display the results when you win or lose. 

### Play Instructions
 - Press A to move to the left, and press D to move to the right.
 - Press Ctrl+r to restart the game at any time.
 - There are two different view mode available: world view and car view.
 - By default, the game uses static world view.
 - In car view, the camera moves with the car. 
 - Switch to car view by pressing Ctrl+1.
 - Switch to world view by pressing Ctrl+2.

### Features
 - Collision Detection: used to detect if the car hits the prize or the obstacles. 
 - Texture Scrolling: instead of moving the car, textures of the track and backgrounds scrolls backward to make it seems like the car is mocing forward.

### Some other features
 - Rotating flag: the flag on the car rotates when the car moves left or right, and rotates back to normal when the car does not move. 
 - Different camera views: car view and world view. Car view moves the camera along with the car. World view is a static camera showing more ranges. World view is enforced when displaying the results. 
