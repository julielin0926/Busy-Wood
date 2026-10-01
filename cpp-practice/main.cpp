#include <iostream>
using namespace std;

struct Player {   //玩家結構體
    int x;
    int y;
    bool carryingWood;
};

struct Wood {    //木頭結構體
    int x;
    int y;
    bool visible;
};

struct Cabin {   //小屋結構體
    int x;
    int y;
};

struct Tornado {    //龍捲風結構體
    int x;
    int y;
};

struct GameState {   //遊戲狀態結構體
    int score;
    int timeLeft;
};

void PrintGameState(const Player& player, const Wood& wood, const GameState& game) {    //印出遊戲狀態
    cout << "玩家位置: (" << player.x << ", " << player.y << ")" << endl;
    cout << "木頭位置: (" << wood.x << ", " << wood.y << ")" << endl;
    cout << "是否搬木頭: " << player.carryingWood << endl;
    cout << "分數: " << game.score << endl;
    cout << "剩餘時間: " << game.timeLeft << endl;
}

void MovePlayer(Player& player, int dx, int dy) {   //移動玩家位置
    player.x += dx;
    player.y += dy;
}

bool IsSamePosition(const Player& player, const Wood& wood) {  //判斷玩家和木頭是否在同一位置
    return player.x == wood.x && player.y == wood.y;
}

bool IsAtCabin(const Player& player, const Cabin& cabin) {  //判斷玩家是否在小屋內
    return player.x == cabin.x && player.y == cabin.y;
}

bool IsHitTornado(const Player& player, const Tornado& tornado) {   //判斷玩家是否被龍捲風擊中
    return player.x == tornado.x && player.y == tornado.y;
}

void PickUpWood(Player& player, Wood& wood) {
    if (wood.visible && !player.carryingWood && IsSamePosition(player, wood)) {  //判斷玩家是否在木頭位置且沒有搬木頭
        player.carryingWood = true;   //玩家可以搬起木頭
        wood.visible = false;
        cout << "撿到木頭了！" << endl;
    }
}

void DropWoodAtCabin(Player& player, GameState& game, const Cabin& cabin) {     //判斷玩家是否在小屋內且有搬木頭
    if (player.carryingWood && IsAtCabin(player, cabin)) {
        player.carryingWood = false;
        game.score += 1;
        cout << "成功把木頭搬回小屋！分數 +1" << endl;
    }
}

void CheckTornadoHit(Player& player, Wood& wood, const Tornado& tornado) {      //判斷玩家是否被龍捲風擊中
    if (IsHitTornado(player, tornado)) {
        cout << "撞到龍捲風！" << endl;

        if (player.carryingWood) {
            player.carryingWood = false;
            wood.visible = true;
            wood.x = player.x;
            wood.y = player.y;

            cout << "木頭掉落了！" << endl;
        }
    }
}

int main() {
    Player player = {5, 5, false};
    Wood wood = {6, 5, true};
    Cabin cabin = {8, 5};
    GameState game = {0, 60};

    PrintGameState(player, wood, game);

    MovePlayer(player, 1, 0);
    PickUpWood(player, wood);

    MovePlayer(player, 1, 0);
    MovePlayer(player, 1, 0);
    DropWoodAtCabin(player, game, cabin);

    PrintGameState(player, wood, game);

    return 0;
}