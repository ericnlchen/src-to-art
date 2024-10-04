import random
import time

class Character:
    def __init__(self, name, health, attack, defense):
        self.name = name
        self.health = health
        self.attack = attack
        self.defense = defense

    def take_damage(self, damage):
        self.health -= max(0, damage - self.defense)

    def is_alive(self):
        return self.health > 0

    def attack_target(self, target):
        damage = self.attack
        target.take_damage(damage)
        print(f"{self.name} attacks {target.name} for {damage} damage!")

def create_character():
    name = input("Enter your character's name: ")
    health = int(input("Enter your character's health: "))
    attack = int(input("Enter your character's attack: "))
    defense = int(input("Enter your character's defense: "))
    return Character(name, health, attack, defense)

def battle(player, enemy):
    while player.is_alive() and enemy.is_alive():
        print(f"\n{player.name}'s health: {player.health}")
        print(f"{enemy.name}'s health: {enemy.health}")

        choice = input("Attack or defend? (a/d): ")
        if choice.lower() == 'a':
            player.attack_target(enemy)
        elif choice.lower() == 'd':
            player.defense *= 2
            print(f"{player.name} defends!")
        else:
            print("Invalid choice!")

        time.sleep(1)

        if enemy.is_alive():
            enemy.attack_target(player)
            player.defense /= 2
            time.sleep(1)

    if player.is_alive():
        print(f"\nYou defeated {enemy.name}!")
    else:
        print(f"\nYou were defeated by {enemy.name}!")

if __name__ == "__main__":
    print("Welcome to the Adventure Game!")

    player = create_character()
    enemies = [
        Character("Goblin", 50, 10, 5),
        Character("Orc", 70, 15, 8),
        Character("Dragon", 100, 20, 10)
    ]

    for enemy in enemies:
        print(f"\nYou encounter a {enemy.name}!")
        battle(player, enemy)
        if not player.is_alive():
            break

    if player.is_alive():
        print("\nCongratulations, you have completed the adventure!")