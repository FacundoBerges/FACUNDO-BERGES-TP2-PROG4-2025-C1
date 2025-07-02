import { Component, inject, OnInit, signal } from '@angular/core';

import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { DividerModule } from 'primeng/divider';

import { User } from '@auth/interfaces/user.interface';
import { AuthService } from '@auth/services/auth.service';
import { Post } from '@core/interfaces/post';
import { PostService } from '@core/services/post.service';
import { UserImageComponent } from '@core/components/profile/user-image/user-image.component';
import { UserInfoComponent } from '@core/components/profile/user-info/user-info.component';
import { PostListComponent } from '@core/components/post/post-list/post-list.component';

@Component({
  selector: 'sn-profile-page',
  imports: [
    AnimateOnScrollModule,
    DividerModule,
    UserImageComponent,
    UserInfoComponent,
    PostListComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  private authService = inject(AuthService);
  private postService = inject(PostService);
  public user = signal<User>({} as User);
  public posts = signal<Post[]>([]);

  ngOnInit(): void {
    // Simulate fetching user data
    const fetchedUser: User = {
      _id: 'generated-id',
      name: 'Nombre',
      surname: 'Apellido',
      email: 'email@mail.com',
      username: 'nombreusuario',
      birthday: new Date('1990-10-22'),
      bio: 'Este es un ejemplo de biografía. Puedes personalizarlo como desees.',
      profilePictureUrl: undefined,
      isActive: true,
      profile: 'user',
      createdAt: new Date('2023-10-22T10:00:00Z'),
    };

    const fetchedPosts: Post[] = [
      {
        _id: '6860528592d405a5c4f26f4e',
        title: 'Post de administrador',
        description: 'Publicación de prueba para subir una imagen!',
        imageUrl:
          '/uploads/img/posts/1751143040088-4k-space-pictures-zp773pnlw9zp3jq7.jpg',
        commentsCount: 0,
        author: {
          _id: '6854368fb4037ca91ff569af',
          name: 'Admin',
          surname: 'Sistema',
          username: 'adminuser',
          profilePictureUrl: null,
        },
        createdAt: '2025-06-28T20:37:25.520Z',
        updatedAt: '2025-06-28T20:37:25.520Z',
        likesCount: 0,
        likes: [],
      },
      {
        _id: '685ff2744fe5ba0f4b82ad90',
        title: 'Un nuevo post',
        description: 'Testeando un nuevo posteo!',
        imageUrl: null,
        commentsCount: 0,
        author: {
          _id: '68542db8c2690b735bc0d443',
          name: 'Pedro',
          surname: 'Lopez',
          username: 'pedrolopez123.-',
          profilePictureUrl: '/uploads/img/users/1750636310018-esferas.jpeg',
        },
        createdAt: '2025-06-28T13:47:32.986Z',
        updatedAt: '2025-06-28T13:47:32.986Z',
        likesCount: 0,
        likes: [],
      },
      {
        _id: '685ff1e65ba7f5200fe1ff98',
        title: 'Un título',
        description: 'Una descripción de publicación!',
        imageUrl: null,
        commentsCount: 0,
        author: {
          _id: '68542db8c2690b735bc0d443',
          name: 'Pedro',
          surname: 'Lopez',
          username: 'pedrolopez123.-',
          profilePictureUrl: '/uploads/img/users/1750636310018-esferas.jpeg',
        },
        createdAt: '2025-06-28T13:45:10.106Z',
        updatedAt: '2025-06-28T13:45:10.106Z',
        likesCount: 0,
        likes: [],
      },
      {
        _id: '68545e6b425b665e0cd56392',
        title: 'Mi segundo post',
        description:
          'Este es el contenido de mi segundo post en la red social, esta vez con imagen!',
        imageUrl: '/uploads/img/posts/1750636310018-esferas.jpeg',
        commentsCount: 3,
        author: {
          _id: '685429cc540ab43148ac9e55',
          name: 'Juan',
          surname: 'Pérez',
          username: 'juanperez',
          profilePictureUrl: null,
        },
        createdAt: '2025-06-19T19:00:59.473Z',
        updatedAt: '2025-06-27T00:32:32.723Z',
        likesCount: 2,
        likes: [
          {
            _id: '685429cc540ab43148ac9e55',
            name: 'Juan',
            surname: 'Pérez',
            username: 'juanperez',
            profilePictureUrl: null,
          },
          {
            _id: '68542db8c2690b735bc0d443',
            name: 'Pedro',
            surname: 'Lopez',
            username: 'pedrolopez123.-',
            profilePictureUrl: '/uploads/img/users/1750636310018-esferas.jpeg',
          },
        ],
      },
      {
        _id: '68545d97425b665e0cd56390',
        title: 'Mi primer post',
        description: 'Este es el contenido de mi primer post en la red social',
        imageUrl: null,
        commentsCount: 0,
        author: {
          _id: '685429cc540ab43148ac9e55',
          name: 'Juan',
          surname: 'Pérez',
          username: 'juanperez',
          profilePictureUrl: null,
        },
        createdAt: '2025-06-19T18:57:27.081Z',
        updatedAt: '2025-06-27T00:23:19.094Z',
        likesCount: 2,
        likes: [
          {
            _id: '685429cc540ab43148ac9e55',
            name: 'Juan',
            surname: 'Pérez',
            username: 'juanperez',
            profilePictureUrl: null,
          },
          {
            _id: '68542db8c2690b735bc0d443',
            name: 'Pedro',
            surname: 'Lopez',
            username: 'pedrolopez123.-',
            profilePictureUrl: '/uploads/img/users/1750636310018-esferas.jpeg',
          },
        ],
      },
    ];

    this.user.set(fetchedUser);
    this.posts.set(fetchedPosts);
  }
}
