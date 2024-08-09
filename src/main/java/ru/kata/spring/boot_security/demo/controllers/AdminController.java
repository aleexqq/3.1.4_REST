package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.util.ArrayList;
import java.util.List;

@Controller()
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }


    @GetMapping
    public ModelAndView getAdminPage(@RequestParam(value = "id", required = false) Long id) {
        List<User> users = new ArrayList<>();
        ModelAndView modelAndView = new ModelAndView();
        if (id == null || userService.getUserById(id) == null) {
            users = userService.allUsers();
            modelAndView.addObject("users", users);
        } else {
            users.add(userService.getUserById(id));
            modelAndView.addObject("users", users);
        }
        modelAndView.addObject("roles", roleService.findAll());
        modelAndView.setViewName("admin/admin");
        return modelAndView;
    }


    @GetMapping("/findOne")
    @ResponseBody
    public User findOne(@RequestParam Long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/save")
    public String save(User user) {
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @PostMapping("/delete")
    public String delete(Long id) {
        userService.deleteUser(userService.getUserById(id));
        return "redirect:/admin";
    }
}
