import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import random


class ChatConsumer(WebsocketConsumer):
    robot_coordinates = {}
    gems_coordinates = {}
    actual_direction = 'north'
    wall = False
    sendwallsignal = False
    BOARD_FIELD_SIZE = NUMBER_OF_GEMS = 2
    SIZE_FIELD = 40
    center_fields = []
    for i in range(BOARD_FIELD_SIZE):
        center_fields.append((SIZE_FIELD / 2) + (i * SIZE_FIELD))

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']

        if self.room_name not in self.robot_coordinates:
            ROBOT_X = random.choice(self.center_fields)
            ROBOT_Y = random.choice(self.center_fields)
            self.robot_coordinates[self.room_name] = [ROBOT_X, ROBOT_Y]

        if self.room_name not in self.gems_coordinates:
            self.gems_coordinates[self.room_name] = []
            for i in range(self.NUMBER_OF_GEMS):
                while True:
                    GEM_X = random.choice(self.center_fields)
                    GEM_Y = random.choice(self.center_fields)
                    if [GEM_X, GEM_Y] not in self.gems_coordinates[self.room_name]:
                        self.gems_coordinates[self.room_name].append([GEM_X, GEM_Y])
                        break
        print(self.gems_coordinates[self.room_name])


        print(self.room_name)
        self.room_group_name = 'chat_%s' % self.room_name
        print("GGGGGGG")

        # Join room group
        async_to_sync(self.channel_layer.send)(
            self.channel_name, {
                'type': 'coordinate_message',
                'coordinate_robot': self.robot_coordinates[self.room_name],
                'coordinate_gems': self.gems_coordinates[self.room_name],
                'wall': self.wall
            })

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name,
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']


        print(message)
        print(self.actual_direction)
        print(self.robot_coordinates)
        if message == 'LEFT':
            if self.actual_direction == 'north':
                self.actual_direction = 'west'
            elif self.actual_direction == 'west':
                self.actual_direction = 'south'
            elif self.actual_direction == 'south':
                self.actual_direction = 'east'
            else:
                self.actual_direction = 'north'
        elif message == 'RIGHT':
            if self.actual_direction == 'north':
                self.actual_direction = 'east'
            elif self.actual_direction == 'east':
                self.actual_direction = 'south'
            elif self.actual_direction == 'south':
                self.actual_direction = 'west'
            else:
                self.actual_direction = 'north'
        elif message == 'GO':
            if self.actual_direction == 'north':
                if self.robot_coordinates[self.room_name][1] == self.SIZE_FIELD/2:
                    self.wall = True
                else:
                    self.robot_coordinates[self.room_name][1] = self.robot_coordinates[self.room_name][1] - 4
            elif self.actual_direction == 'east':
                if self.robot_coordinates[self.room_name][0] == (self.SIZE_FIELD*self.BOARD_FIELD_SIZE) - (self.SIZE_FIELD/2):
                    self.wall = True
                else:
                    self.robot_coordinates[self.room_name][0] = self.robot_coordinates[self.room_name][0] + 4
            elif self.actual_direction == 'south':
                if self.robot_coordinates[self.room_name][1] == (self.SIZE_FIELD*self.BOARD_FIELD_SIZE) - (self.SIZE_FIELD/2):
                    self.wall = True
                else:
                    self.robot_coordinates[self.room_name][1] = self.robot_coordinates[self.room_name][1] + 4
            else:
                if self.robot_coordinates[self.room_name][0] == self.SIZE_FIELD/2:
                    self.wall = True
                else:
                    self.robot_coordinates[self.room_name][0] = self.robot_coordinates[self.room_name][0] - 4
        elif message == 'GET':
            print([self.robot_coordinates[self.room_name][0], self.robot_coordinates[self.room_name][1]])
            print(self.gems_coordinates)
            if [self.robot_coordinates[self.room_name][0], self.robot_coordinates[self.room_name][1]] in self.gems_coordinates[self.room_name]:
                self.gems_coordinates[self.room_name].remove([self.robot_coordinates[self.room_name][0], self.robot_coordinates[self.room_name][1]])
                print(self.gems_coordinates[self.room_name])

        # Send message to room group`
        if not self.sendwallsignal:
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'coordinate_message',
                    'coordinate_gems': self.gems_coordinates[self.room_name],
                    'coordinate_robot': self.robot_coordinates[self.room_name],
                    'wall': self.wall
                }
            )
            if self.wall:
                self.sendwallsignal = True



    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))

    # handler
    def coordinate_message(self, event):
        coordinates_robot = event['coordinate_robot']
        coordinates_gems = event['coordinate_gems']
        wall = event['wall']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'coordinate_robot': coordinates_robot,
            'coordinate_gems': coordinates_gems,
            'wall': wall
        }))



