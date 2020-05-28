import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import random


class ChatConsumer(WebsocketConsumer):
    room_coordinates = {}
    actual_direction = 'north'
    wall = False
    sendwallsignal = False
    BOARD_FIELD_SIZE = 10
    SIZE_FIELD = 40

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']

        if self.room_name not in self.room_coordinates:


            center_fields = []
            for i in range(self.BOARD_FIELD_SIZE):
                center_fields.append((self.SIZE_FIELD / 2) + (i * self.SIZE_FIELD))

            ROBOT_X = random.choice(center_fields)
            ROBOT_Y = random.choice(center_fields)
            self.room_coordinates[self.room_name] = [ROBOT_X, ROBOT_Y]

        print(self.room_name)
        self.room_group_name = 'chat_%s' % self.room_name
        print("GGGGGGG")

        # Join room group
        async_to_sync(self.channel_layer.send)(
            self.channel_name, {
                'type': 'coordinate_message',
                'coordinate_robot': self.room_coordinates[self.room_name],
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
        print(self.room_coordinates)
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
                if self.room_coordinates[self.room_name][1] == self.SIZE_FIELD/2:
                    self.wall = True
                else:
                    self.room_coordinates[self.room_name][1] = self.room_coordinates[self.room_name][1] - 4
            elif self.actual_direction == 'east':
                if self.room_coordinates[self.room_name][0] == (self.SIZE_FIELD*self.BOARD_FIELD_SIZE) - (self.SIZE_FIELD/2):
                    self.wall = True
                else:
                    self.room_coordinates[self.room_name][0] = self.room_coordinates[self.room_name][0] + 4
            elif self.actual_direction == 'south':
                if self.room_coordinates[self.room_name][1] == (self.SIZE_FIELD*self.BOARD_FIELD_SIZE) - (self.SIZE_FIELD/2):
                    self.wall = True
                else:
                    self.room_coordinates[self.room_name][1] = self.room_coordinates[self.room_name][1] + 4
            else:
                if self.room_coordinates[self.room_name][0] == self.SIZE_FIELD/2:
                    self.wall = True
                else:
                    self.room_coordinates[self.room_name][0] = self.room_coordinates[self.room_name][0] - 4
        # print(self.room_coordinates)
        # Send message to room group`
        if not self.sendwallsignal:
            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    'type': 'coordinate_message',
                    'coordinate_robot': self.room_coordinates[self.room_name],
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
        wall = event['wall']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'coordinate': coordinates_robot,
            'wall': wall
        }))



