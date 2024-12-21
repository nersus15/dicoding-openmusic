const mapDBToModelSongs = ({
    id, title, year, genre, performer, duration, albumid
}) => ({
    id, title, year, genre, performer, duration, albumId: albumid
});

module.exports = {mapDBToModelSongs};