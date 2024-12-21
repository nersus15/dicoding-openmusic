/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    // songs
    pgm.addConstraint('songs', 'fk_songs.albumid', 'FOREIGN KEY(albumid) REFERENCES albums(id) ON DELETE CASCADE');

    // playlists
    pgm.addConstraint('playlists', 'fk_playlist.owner', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

    // playlist_song
    pgm.addConstraint('playlist_song', 'fk_playlist_song.playlist_id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
    pgm.addConstraint('playlist_song', 'fk_playlist_song.song_id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');

    // collaborations
    pgm.addConstraint('collaborations', 'fk_collaborations.playlist_id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
    pgm.addConstraint('collaborations', 'fk_collaborations.user_id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');

    // playlist_song_activities
    pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
    pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.song_id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
    pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.user_id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    // songs
    pgm.dropConstraint('songs', 'fk_songs.albumid');

    // playlists
    pgm.dropConstraint('playlists', 'fk_playlist.owner');

    // playlist_song
    pgm.dropConstraint('playlist_song', 'fk_playlist_song.playlist_id');
    pgm.dropConstraint('playlist_song', 'fk_playlist_song.song_id');

    // collaborations
    pgm.dropConstraint('collaborations', 'fk_collaborations.playlist_id');
    pgm.dropConstraint('collaborations', 'fk_collaborations.user_id');

    // playlist_song_activities
    pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id');
    pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.song_id');
    pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.user_id');
};
